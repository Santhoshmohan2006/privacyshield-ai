import React, { useState, useEffect } from 'react';

const TypeWriter = ({ words = [], speed = 100, deleteSpeed = 50, delayBetween = 2000, className = '' }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[currentWordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
      }, deleteSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1));
      }, speed);
    }

    if (!isDeleting && currentText === word) {
      timer = setTimeout(() => setIsDeleting(true), delayBetween);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, deleteSpeed, delayBetween]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-blink text-primary">|</span>
    </span>
  );
};

export default TypeWriter;
