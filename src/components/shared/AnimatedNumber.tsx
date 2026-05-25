import { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  formatter?: (v: number) => string;
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 800,
  className = '',
  formatter,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startValue.current = display;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Easing: easeOutExpo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = startValue.current + (value - startValue.current) * eased;
      
      setDisplay(current);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  const formatted = formatter
    ? formatter(display)
    : decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
