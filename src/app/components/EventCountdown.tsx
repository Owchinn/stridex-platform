'use client';

import { useState, useEffect } from 'react';

interface EventCountdownProps {
  registrationDeadline: string;
}

export default function EventCountdown({ registrationDeadline }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(registrationDeadline).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('00:00:00:00');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Format as DD:HH:MM:SS
      const formatted = [
        days.toString().padStart(2, '0'),
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');

      setTimeLeft(formatted);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [registrationDeadline]);

  if (isExpired) {
    return (
      <div style={{ padding: '1rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
        Registration Closed
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Registration Closes In:</span>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {timeLeft.split(':').map((unit, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{unit}</span>
            <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {['Days', 'Hours', 'Mins', 'Secs'][idx]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
