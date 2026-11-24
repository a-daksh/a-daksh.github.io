import React from 'react';

// "DA" monogram (option C: outlined tile, mono font). Colors follow the theme variables.
// Border width matches the letter stem width: SF Mono semibold stems are ~0.117 em -> 0.117 * 15 = 1.75.
const STEM = 1.75;

const IconLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width="40"
    height="40"
    role="img"
    aria-label="Daksh Adhar">
    <title>Daksh Adhar</title>
    <rect
      x={1 + STEM / 2}
      y={1 + STEM / 2}
      width={38 - STEM}
      height={38 - STEM}
      rx="8"
      style={{ fill: 'none', stroke: 'var(--color-text-primary)', strokeWidth: STEM }}
    />
    <text
      x="20"
      y="20.6"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: 'var(--color-text-primary)',
        font: '600 15px "SF Mono", monospace',
        letterSpacing: '-0.4px',
      }}>
      DA
    </text>
  </svg>
);

export default IconLogo;
