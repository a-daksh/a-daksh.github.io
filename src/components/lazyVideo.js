import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Sits on top of the (lazy, responsive) cover image and fades in once it is actually playing.
const StyledVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $playing }) => ($playing ? 1 : 0)};
  transition: opacity 0.4s var(--easing);
`;

/*
 * Background preloading: once the page has loaded and gone quiet, download the videos one at a
 * time, in page order, so they're ready by the time the visitor scrolls to them. A video that
 * comes on screen first simply starts loading right away (and the queue skips it).
 * Skipped on data-saver / slow connections, where videos load only when they come into view.
 */
const PRELOAD_AFTER_MS = 3000; // after page load: leaves the network to the page and the 3D hero first
const PRELOAD_TIMEOUT_MS = 20000; // don't let one stuck video block the rest of the queue

const queue = [];
let preloadScheduled = false;

const slowConnection = () => {
  const c = typeof navigator !== 'undefined' && navigator.connection;
  return !!c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || ''));
};

const loadSrc = (video, src) => {
  if (!video.getAttribute('src')) {
    video.preload = 'auto';
    video.setAttribute('src', src);
  }
};

const preloadNext = () => {
  const item = queue.shift();
  if (!item) {
    return;
  }
  const { video, src } = item;
  if (!video.isConnected || video.getAttribute('src')) {
    preloadNext(); // removed from the page, or already loading because it came on screen
    return;
  }
  let finished = false;
  const done = () => {
    if (finished) {
      return;
    }
    finished = true;
    video.removeEventListener('canplaythrough', done);
    video.removeEventListener('error', done);
    preloadNext();
  };
  video.addEventListener('canplaythrough', done);
  video.addEventListener('error', done);
  setTimeout(done, PRELOAD_TIMEOUT_MS);
  loadSrc(video, src);
};

const schedulePreload = () => {
  if (preloadScheduled || slowConnection()) {
    return;
  }
  preloadScheduled = true;
  const start = () =>
    setTimeout(() => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(preloadNext, { timeout: 2000 });
      } else {
        preloadNext();
      }
    }, PRELOAD_AFTER_MS);
  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }
};

/**
 * GIF-style looping video (muted, inline, no controls). It plays while near the viewport and pauses
 * while off-screen; it is downloaded either in the background (see above) or when it first comes
 * near the viewport. Purely decorative: the cover image underneath carries the alt text and is what
 * visitors with reduced motion (or without video support) see.
 */
const LazyVideo = ({ src, className }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    queue.push({ video, src });
    schedulePreload();

    const play = () => {
      loadSrc(video, src);
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {}); // autoplay can be refused (e.g. data saver); the cover image stays.
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <StyledVideo
      ref={ref}
      className={className}
      $playing={playing}
      onPlaying={() => setPlaying(true)}
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="none"
    />
  );
};

LazyVideo.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default LazyVideo;
