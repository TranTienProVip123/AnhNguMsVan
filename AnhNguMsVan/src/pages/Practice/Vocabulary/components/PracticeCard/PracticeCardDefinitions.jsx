import React, { memo } from 'react';

// Helper: Mask từ vựng trong example
const maskWordInExample = (example, targetWord) => {
  if (!example || !targetWord) return example;
  const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
  return example.replace(regex, (match) => '*'.repeat(match.length));
};

// Helper: Highlight từ vựng trong example
const highlightWordInExample = (example, targetWord) => {
  if (!example || !targetWord) return example;
  const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
  const parts = example.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === targetWord.toLowerCase()) {
      return (
        <mark key={index} className="word-highlight">
          {part}
        </mark>
      );
    }
    return part;
  });
};

const PracticeCardDefinitions = memo(({ word, showAnswer }) => {
  return (
    <div className="word-definitions">
      {word.definition && (
        <p className="definition-en">
          <strong>Định nghĩa tiếng Anh:</strong> {word.definition}
        </p>
      )}
      
      {word.meaning && (
        <p className="definition-vn">
          <strong>Định nghĩa tiếng Việt:</strong> {word.meaning}
        </p>
      )}
      
      {word.example && (
        <p className="example-en">
          <strong>Ví dụ tiếng Anh:</strong>{' '}
          <span className={`example-text ${showAnswer ? 'revealed' : 'masked'}`}>
            {showAnswer 
              ? highlightWordInExample(word.example, word.english)
              : maskWordInExample(word.example, word.english)
            }
          </span>
        </p>
      )}
      
      {word.exampleVN && (
        <p className="example-vn">
          <strong>Ví dụ tiếng Việt:</strong> {word.exampleVN}
        </p>
      )}
    </div>
  );
});

PracticeCardDefinitions.displayName = 'PracticeCardDefinitions';

export default PracticeCardDefinitions;