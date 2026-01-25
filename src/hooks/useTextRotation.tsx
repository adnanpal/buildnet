import  { useState, useEffect } from 'react';

const useTextRotation = (texts: string | any[], interval = 2000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return { currentText: texts[currentIndex], currentIndex };
};
export default useTextRotation;