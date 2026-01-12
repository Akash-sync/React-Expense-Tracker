import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import RotatingText from './RotatingText';

const EntryAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show animation for 6 seconds (3 texts × 2 seconds each) + fade out time
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 6 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        zIndex: 50,
        pointerEvents: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#ffffff' }}>
          Track
        </span>
        <div style={{ 
          display: 'inline-flex',
          padding: '1rem 1.5rem',
          backgroundColor: '#22c55e',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '3rem',
          fontWeight: 'bold'
        }}>
          <RotatingText
            texts={['Expenses', 'Budget', 'Spending']}
            mainClassName=""
            staggerFrom="last"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            rotationInterval={2000}
            loop={false}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EntryAnimation;
