import { useState, useEffect } from 'react';

const useBeepDetection = (callback) => {
  const [keySequence, setKeySequence] = useState('');

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only track letter keys, ignore special keys
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        setKeySequence(prev => {
          const newSequence = (prev + event.key.toLowerCase()).slice(-4); // Keep last 4 characters
          
          if (newSequence === 'beep') {
            callback();
            return ''; // Reset after triggering
          }
          
          return newSequence;
        });
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [callback]);

  // Reset sequence after 3 seconds of inactivity
  useEffect(() => {
    if (keySequence.length > 0) {
      const timer = setTimeout(() => {
        setKeySequence('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [keySequence]);

  return keySequence;
};

export default useBeepDetection;