import React, { memo } from 'react';

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black">
    <path d="M3 10v4h4l5 5V5L7 10H3z" />
    <path d="M16.5 12c0-2.49-1.51-4.6-3.5-5.5v11c1.99-.9 3.5-3.01 3.5-5.5z" />
    <path d="M19 12c0 3.86-2.2 7.16-5.33 8.65v-2.02c2.38-1.23 4.03-3.66 4.03-6.63s-1.65-5.4-4.03-6.63V3.35C16.8 4.84 19 8.14 19 12z" />
  </svg>
);

const PracticeCardPhonetics = memo(({ word, playPronunciation }) => {
  return (
    <div className="phonetics-section">
      <div className="phonetic-row">
        <div className="phonetic-item">
          <span className="phonetic-label">US</span>
          <button
            className="audio-btn"
            onClick={() => playPronunciation(word.english, 'US')}
            type="button"
            title="Phát âm US"
          >
            <AudioIcon />
          </button>
          <span className="phonetic-text">
            /{word.phoneticUS || word.english}/
          </span>

          <span className="phonetic-label">UK</span>
          <button
            className="audio-btn"
            onClick={() => playPronunciation(word.english, 'UK')}
            type="button"
            title="Phát âm UK"
          >
            <AudioIcon />
          </button>
          <span className="phonetic-text">
            /{word.phoneticUK || word.english}/
          </span>
        </div>
      </div>
    </div>
  );
});

PracticeCardPhonetics.displayName = 'PracticeCardPhonetics';

export default PracticeCardPhonetics;