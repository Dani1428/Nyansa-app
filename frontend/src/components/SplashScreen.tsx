import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const text = "NYANSA";

  useEffect(() => {
    // Start fade out at 2.5s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Call onComplete at 3.0s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-word">
        {text.split('').map((letter, index) => (
          <span 
            key={index} 
            className="splash-letter"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
