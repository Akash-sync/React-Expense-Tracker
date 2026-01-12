import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PixelBlast from './components/PixelBlast';
import PillNav from './components/PillNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './styles.css';

const navItems = [
  { label: 'Dashboard', path: '/', ariaLabel: 'Go to Dashboard' },
  { label: 'Transactions', path: '/transactions', ariaLabel: 'View All Transactions' },
  { label: 'Reports', path: '/reports', ariaLabel: 'View Financial Reports' },
  { label: 'Settings', path: '/settings', ariaLabel: 'App Settings' }
];

export default function App() {
  return (
    <Router>
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#22c55e"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
          autoPauseOffscreen={true}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <PillNav
          items={navItems}
          baseColor="#1f2937"
          pillColor="#111827"
          hoveredPillTextColor="#e5e7eb"
          pillTextColor="#9ca3af"
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}