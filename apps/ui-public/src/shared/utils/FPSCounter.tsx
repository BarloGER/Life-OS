import { useState, useEffect, useRef } from 'react';

export const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const calculateFPS = () => {
      frameCount.current += 1;
      const now = performance.now();
      const delta = now - lastFrameTime.current;

      if (delta >= 1000) {
        setFps((frameCount.current / delta) * 1000);
        frameCount.current = 0;
        lastFrameTime.current = now;
      }

      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    animationFrameId = requestAnimationFrame(calculateFPS);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '5px 10px',
        zIndex: 9999,
        fontSize: '14px',
      }}
    >
      FPS: {Math.round(fps)}
    </div>
  );
};
