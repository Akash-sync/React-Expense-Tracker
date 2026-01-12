import { useEffect, useState } from 'react';

export default function AchievementBadge({ show, onClose, amount }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.8})`,
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 10000,
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                    borderRadius: '20px',
                    padding: '32px 48px',
                    boxShadow: '0 20px 60px rgba(20, 184, 166, 0.4)',
                    textAlign: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                {/* Badge Icon */}
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        animation: 'bounce 0.6s ease-in-out',
                    }}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                {/* Title */}
                <h2
                    style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '8px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    Goal Achieved!
                </h2>

                {/* Message */}
                <p
                    style={{
                        fontSize: '18px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '12px',
                    }}
                >
                    You saved ₹{amount?.toLocaleString('en-IN')}
                </p>

                {/* Badge Label */}
                <div
                    style={{
                        display: 'inline-block',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                    }}
                >
                    Savings Sprint Champion
                </div>
            </div>

            {/* Inline keyframes */}
            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
