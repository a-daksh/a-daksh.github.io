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

/**
 * GIF-style looping video (muted, inline, no controls) that only downloads when it comes near the
 * viewport and pauses while off-screen. Purely decorative: the cover image underneath carries the
 * alt text and is what visitors with reduced motion (or without video support) see.
 */
const LazyVideo = ({ src, className }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const play = () => {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', src);
      }
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
      { rootMargin: '300px 0px' },
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
