export function initBunnyPlayer() {
  document.querySelectorAll('[data-bunny-player-init]').forEach(function (player) {
    const src = player.getAttribute('data-player-src');
    if (!src) return;

    const video = player.querySelector('video');
    if (!video) return;

    try {
      video.pause();
    } catch (_) {}
    try {
      video.removeAttribute('src');
      video.load();
    } catch (_) {}

    // Attribute helpers
    function setStatus(s) {
      if (player.getAttribute('data-player-status') !== s) {
        player.setAttribute('data-player-status', s);
      }
    }
    function setMutedState(v) {
      video.muted = !!v;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }
    function setFsAttr(v) {
      player.setAttribute('data-player-fullscreen', v ? 'true' : 'false');
    }
    function setActivated(v) {
      player.setAttribute('data-player-activated', v ? 'true' : 'false');
    }
    if (!player.hasAttribute('data-player-activated')) setActivated(false);

    // Elements
    const timeline = player.querySelector('[data-player-timeline]');
    const progressBar = player.querySelector('[data-player-progress]');
    const bufferedBar = player.querySelector('[data-player-buffered]');
    const handle = player.querySelector('[data-player-timeline-handle]');
    const timeDurationEls = player.querySelectorAll('[data-player-time-duration]');
    const timeProgressEls = player.querySelectorAll('[data-player-time-progress]');

    // Flags
    const updateSize = player.getAttribute('data-player-update-size'); // "true" | "cover" | null
    const lazyMode = player.getAttribute('data-player-lazy'); // "true" | "meta" | null
    const isLazyTrue = lazyMode === 'true';
    const isLazyMeta = lazyMode === 'meta';
    const autoplay = player.getAttribute('data-player-autoplay') === 'true';
    const initialMuted = player.getAttribute('data-player-muted') === 'true';

    // Used to suppress 'ready' flicker when user just pressed play in lazy modes
    let pendingPlay = false;

    // Autoplay forces muted; IO will trigger "fake click"
    if (autoplay) {
      setMutedState(true);
      video.loop = true;
    } else {
      setMutedState(initialMuted);
    }

    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
    if (typeof video.disableRemotePlayback !== 'undefined') video.disableRemotePlayback = true;
    if (autoplay) video.autoplay = false;

    const isSafariNative = !!video.canPlayType('application/vnd.apple.mpegurl');
    const canUseHlsJs = !!(window.Hls && Hls.isSupported()) && !isSafariNative;

    // Minimal ratio fetch when requested (and not already handled by lazy meta)
    if (updateSize === 'true' && !isLazyMeta) {
      if (isLazyTrue) {
        // Do nothing: no fetch, no <video> touch when lazy=true
      } else {
        const prev = video.preload;
        video.preload = 'metadata';
        const onMeta2 = function () {
          setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
          video.removeEventListener('loadedmetadata', onMeta2);
          video.preload = prev || '';
        };
        video.addEventListener('loadedmetadata', onMeta2, { once: true });
        video.src = src;
      }
    }

    //  Lazy meta fetch (duration + aspect) without attaching playback
    function fetchMetaOnce() {
      getSourceMeta(src, canUseHlsJs).then(function (meta) {
        if (meta.width && meta.height) setBeforeRatio(player, updateSize, meta.width, meta.height);
        if (timeDurationEls.length && isFinite(meta.duration) && meta.duration > 0) {
          setText(timeDurationEls, formatTime(meta.duration));
        }
        readyIfIdle(player, pendingPlay);
      });
    }

    // Attach media only once (for actual playback)
    let isAttached = false;
    let userInteracted = false;
    let lastPauseBy = '';
    function attachMediaOnce() {
      if (isAttached) return;
      isAttached = true;

      if (player._hls) {
        try {
          player._hls.destroy();
        } catch (_) {}
        player._hls = null;
      }

      if (isSafariNative) {
        video.preload = isLazyTrue || isLazyMeta ? 'auto' : video.preload;
        video.src = src;
        video.addEventListener(
          'loadedmetadata',
          function () {
            readyIfIdle(player, pendingPlay);
            if (updateSize === 'true')
              setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
            if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
          },
          { once: true }
        );
      } else if (canUseHlsJs) {
        const hls = new Hls({ maxBufferLength: 10 });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(src);
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          readyIfIdle(player, pendingPlay);
          if (updateSize === 'true') {
            const lvls = hls.levels || [];
            const best = bestLevel(lvls);
            if (best && best.width && best.height)
              setBeforeRatio(player, updateSize, best.width, best.height);
          }
        });
        hls.on(Hls.Events.LEVEL_LOADED, function (e, data) {
          if (data && data.details && isFinite(data.details.totalduration)) {
            if (timeDurationEls.length)
              setText(timeDurationEls, formatTime(data.details.totalduration));
          }
        });
        player._hls = hls;
      } else {
        video.src = src;
      }
    }

    // Initialize based on lazy mode
    if (isLazyMeta) {
      fetchMetaOnce();
      video.preload = 'none';
    } else if (isLazyTrue) {
      video.preload = 'none';
    } else {
      attachMediaOnce();
    }

    // Toggle play/pause
    function togglePlay() {
      userInteracted = true;
      if (video.paused || video.ended) {
        if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
        pendingPlay = true;
        lastPauseBy = '';
        setStatus('loading');
        safePlay(video);
      } else {
        lastPauseBy = 'manual';
        video.pause();
      }
    }

    // Toggle mute
    function toggleMute() {
      video.muted = !video.muted;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }

    // Fullscreen helpers
    function isFsActive() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }
    function enterFullscreen() {
      if (player.requestFullscreen) return player.requestFullscreen();
      if (video.requestFullscreen) return video.requestFullscreen();
      if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === 'function')
        return video.webkitEnterFullscreen();
    }
    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (video.webkitDisplayingFullscreen && typeof video.webkitExitFullscreen === 'function')
        return video.webkitExitFullscreen();
    }
    function toggleFullscreen() {
      if (isFsActive() || video.webkitDisplayingFullscreen) exitFullscreen();
      else enterFullscreen();
    }
    document.addEventListener('fullscreenchange', function () {
      setFsAttr(isFsActive());
    });
    document.addEventListener('webkitfullscreenchange', function () {
      setFsAttr(isFsActive());
    });
    video.addEventListener('webkitbeginfullscreen', function () {
      setFsAttr(true);
    });
    video.addEventListener('webkitendfullscreen', function () {
      setFsAttr(false);
    });

    // Controls (delegated)
    player.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-player-control]');
      if (!btn || !player.contains(btn)) return;
      const type = btn.getAttribute('data-player-control');
      if (type === 'play' || type === 'pause' || type === 'playpause') togglePlay();
      else if (type === 'mute') toggleMute();
      else if (type === 'fullscreen') toggleFullscreen();
    });

    // Time text (not in rAF)
    function updateTimeTexts() {
      if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
      if (timeProgressEls.length) setText(timeProgressEls, formatTime(video.currentTime));
    }
    video.addEventListener('timeupdate', updateTimeTexts);
    video.addEventListener('loadedmetadata', function () {
      updateTimeTexts();
      maybeSetRatioFromVideo(player, updateSize, video);
    });
    video.addEventListener('loadeddata', function () {
      maybeSetRatioFromVideo(player, updateSize, video);
    });
    video.addEventListener('playing', function () {
      maybeSetRatioFromVideo(player, updateSize, video);
    });
    video.addEventListener('durationchange', updateTimeTexts);

    // rAF visuals (progress + handle only)
    let rafId;
    function updateProgressVisuals() {
      if (!video.duration) return;
      const playedPct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + playedPct) + '%)';
      if (handle) handle.style.left = playedPct + '%';
    }
    function loop() {
      updateProgressVisuals();
      if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
    }

    // Buffered bar (not in rAF)
    function updateBufferedBar() {
      if (!bufferedBar || !video.duration || !video.buffered.length) return;
      const end = video.buffered.end(video.buffered.length - 1);
      const buffPct = (end / video.duration) * 100;
      bufferedBar.style.transform = 'translateX(' + (-100 + buffPct) + '%)';
    }
    video.addEventListener('progress', updateBufferedBar);
    video.addEventListener('loadedmetadata', updateBufferedBar);
    video.addEventListener('durationchange', updateBufferedBar);

    // Media event wiring
    video.addEventListener('play', function () {
      setActivated(true);
      cancelAnimationFrame(rafId);
      loop();
      setStatus('playing');
    });
    video.addEventListener('playing', function () {
      pendingPlay = false;
      setStatus('playing');
    });
    video.addEventListener('pause', function () {
      pendingPlay = false;
      cancelAnimationFrame(rafId);
      updateProgressVisuals();
      setStatus('paused');
    });
    video.addEventListener('waiting', function () {
      setStatus('loading');
    });
    video.addEventListener('canplay', function () {
      readyIfIdle(player, pendingPlay);
    });
    video.addEventListener('ended', function () {
      pendingPlay = false;
      cancelAnimationFrame(rafId);
      updateProgressVisuals();
      setStatus('paused');
      setActivated(false);
    });

    // Scrubbing (pointer events)
    if (timeline) {
      let dragging = false,
        wasPlaying = false,
        targetTime = 0,
        lastSeekTs = 0,
        seekThrottle = 180,
        rect = null;
      window.addEventListener('resize', function () {
        if (!dragging) rect = null;
      });
      function getFractionFromX(x) {
        if (!rect) rect = timeline.getBoundingClientRect();
        let f = (x - rect.left) / rect.width;
        if (f < 0) f = 0;
        if (f > 1) f = 1;
        return f;
      }
      function previewAtFraction(f) {
        if (!video.duration) return;
        const pct = f * 100;
        if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + pct) + '%)';
        if (handle) handle.style.left = pct + '%';
        if (timeProgressEls.length) setText(timeProgressEls, formatTime(f * video.duration));
      }
      function maybeSeek(now) {
        if (!video.duration) return;
        if (now - lastSeekTs < seekThrottle) return;
        lastSeekTs = now;
        video.currentTime = targetTime;
      }
      function onPointerDown(e) {
        if (!video.duration) return;
        dragging = true;
        wasPlaying = !video.paused && !video.ended;
        if (wasPlaying) video.pause();
        player.setAttribute('data-timeline-drag', 'true');
        rect = timeline.getBoundingClientRect();
        const f = getFractionFromX(e.clientX);
        targetTime = f * video.duration;
        previewAtFraction(f);
        maybeSeek(performance.now());
        timeline.setPointerCapture && timeline.setPointerCapture(e.pointerId);
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        e.preventDefault();
      }
      function onPointerMove(e) {
        if (!dragging) return;
        const f = getFractionFromX(e.clientX);
        targetTime = f * video.duration;
        previewAtFraction(f);
        maybeSeek(performance.now());
        e.preventDefault();
      }
      function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        player.setAttribute('data-timeline-drag', 'false');
        rect = null;
        video.currentTime = targetTime;
        if (wasPlaying) safePlay(video);
        else {
          updateProgressVisuals();
          updateTimeTexts();
        }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      timeline.addEventListener('pointerdown', onPointerDown, { passive: false });
      if (handle) handle.addEventListener('pointerdown', onPointerDown, { passive: false });
    }

    // Hover/idle detection (pointer-based)
    let hoverTimer;
    const hoverHideDelay = 3000;
    function setHover(state) {
      if (player.getAttribute('data-player-hover') !== state) {
        player.setAttribute('data-player-hover', state);
      }
    }
    function scheduleHide() {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        setHover('idle');
      }, hoverHideDelay);
    }
    function wakeControls() {
      setHover('active');
      scheduleHide();
    }
    player.addEventListener('pointerdown', wakeControls);
    document.addEventListener('fullscreenchange', wakeControls);
    document.addEventListener('webkitfullscreenchange', wakeControls);
    let trackingMove = false;
    function onPointerMoveGlobal(e) {
      const r = player.getBoundingClientRect();
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      )
        wakeControls();
    }
    player.addEventListener('pointerenter', function () {
      wakeControls();
      if (!trackingMove) {
        trackingMove = true;
        window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true });
      }
    });
    player.addEventListener('pointerleave', function () {
      setHover('idle');
      clearTimeout(hoverTimer);
      if (trackingMove) {
        trackingMove = false;
        window.removeEventListener('pointermove', onPointerMoveGlobal);
      }
    });

    // In-view auto play/pause (only when autoplay is true)
    if (autoplay) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            const inView = entry.isIntersecting && entry.intersectionRatio > 0;

            if (inView) {
              if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();

              if (video.paused) {
                // we will attempt to play -> show loading until events flip to playing
                lastPauseBy = '';
                pendingPlay = true;
                setStatus('loading');
                safePlay(video);
              } else {
                // already playing; don't flash loading
                setStatus('playing');
              }
            } else {
              if (!video.paused && !video.ended) {
                lastPauseBy = 'io';
                video.pause();
                setStatus('paused'); // keep UI honest while out of view
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      io.observe(player);
    }
  });

  // Helper: time/text/meta/ratio utilities
  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    const s = Math.floor(sec),
      h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      r = s % 60;
    return h > 0 ? h + ':' + pad2(m) + ':' + pad2(r) : pad2(m) + ':' + pad2(r);
  }
  function setText(nodes, text) {
    nodes.forEach(function (n) {
      n.textContent = text;
    });
  }

  // Helper: Choose best HLS level by resolution --- */
  function bestLevel(levels) {
    if (!levels || !levels.length) return null;
    return levels.reduce(function (a, b) {
      return (b.width || 0) > (a.width || 0) ? b : a;
    }, levels[0]);
  }

  // Helper: Safe programmatic play
  function safePlay(video) {
    const p = video.play();
    if (p && typeof p.then === 'function') p.catch(function () {});
  }

  // Helper: Ready status guard
  function readyIfIdle(player, pendingPlay) {
    if (
      !pendingPlay &&
      player.getAttribute('data-player-activated') !== 'true' &&
      player.getAttribute('data-player-status') === 'idle'
    ) {
      player.setAttribute('data-player-status', 'ready');
    }
  }

  // Helper: Ratio Setter
  function setBeforeRatio(player, updateSize, w, h) {
    if (updateSize !== 'true' || !w || !h) return;
    const before = player.querySelector('[data-player-before]');
    if (!before) return;
    before.style.paddingTop = (h / w) * 100 + '%';
  }
  function maybeSetRatioFromVideo(player, updateSize, video) {
    if (updateSize !== 'true') return;
    const before = player.querySelector('[data-player-before]');
    if (!before) return;
    const hasPad = before.style.paddingTop && before.style.paddingTop !== '0%';
    if (!hasPad && video.videoWidth && video.videoHeight) {
      setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
    }
  }

  // Helper: simple URL resolver
  function resolveUrl(base, rel) {
    try {
      return new URL(rel, base).toString();
    } catch (_) {
      return rel;
    }
  }

  // Helper: Unified meta fetch (hls.js or native fetch)
  function getSourceMeta(src, useHlsJs) {
    return new Promise(function (resolve) {
      if (useHlsJs && window.Hls && Hls.isSupported()) {
        try {
          const tmp = new Hls();
          const out = { width: 0, height: 0, duration: NaN };
          let haveLvls = false,
            haveDur = false;

          tmp.on(Hls.Events.MANIFEST_PARSED, function (e, data) {
            const lvls = (data && data.levels) || tmp.levels || [];
            const best = bestLevel(lvls);
            if (best && best.width && best.height) {
              out.width = best.width;
              out.height = best.height;
              haveLvls = true;
            }
          });
          tmp.on(Hls.Events.LEVEL_LOADED, function (e, data) {
            if (data && data.details && isFinite(data.details.totalduration)) {
              out.duration = data.details.totalduration;
              haveDur = true;
            }
          });
          tmp.on(Hls.Events.ERROR, function () {
            try {
              tmp.destroy();
            } catch (_) {}
            resolve(out);
          });
          tmp.on(Hls.Events.LEVEL_LOADED, function () {
            try {
              tmp.destroy();
            } catch (_) {}
            resolve(out);
          });

          tmp.loadSource(src);
          return;
        } catch (_) {
          resolve({ width: 0, height: 0, duration: NaN });
          return;
        }
      }

      function parseMaster(masterText) {
        const lines = masterText.split(/\r?\n/);
        let bestW = 0,
          bestH = 0,
          firstMedia = null,
          lastInf = null;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
            lastInf = line;
          } else if (lastInf && line && line[0] !== '#') {
            if (!firstMedia) firstMedia = line.trim();
            const m = /RESOLUTION=(\d+)x(\d+)/.exec(lastInf);
            if (m) {
              const w = parseInt(m[1], 10),
                h = parseInt(m[2], 10);
              if (w > bestW) {
                bestW = w;
                bestH = h;
              }
            }
            lastInf = null;
          }
        }
        return { bestW: bestW, bestH: bestH, media: firstMedia };
      }
      function sumDuration(mediaText) {
        let dur = 0,
          re = /#EXTINF:([\d.]+)/g,
          m;
        while ((m = re.exec(mediaText))) dur += parseFloat(m[1]);
        return dur;
      }

      fetch(src, { credentials: 'omit', cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error('master');
          return r.text();
        })
        .then(function (master) {
          const info = parseMaster(master);
          if (!info.media) {
            resolve({ width: info.bestW || 0, height: info.bestH || 0, duration: NaN });
            return;
          }
          const mediaUrl = resolveUrl(src, info.media);
          return fetch(mediaUrl, { credentials: 'omit', cache: 'no-store' })
            .then(function (r) {
              if (!r.ok) throw new Error('media');
              return r.text();
            })
            .then(function (mediaText) {
              resolve({
                width: info.bestW || 0,
                height: info.bestH || 0,
                duration: sumDuration(mediaText),
              });
            });
        })
        .catch(function () {
          resolve({ width: 0, height: 0, duration: NaN });
        });
    });
  }
}
