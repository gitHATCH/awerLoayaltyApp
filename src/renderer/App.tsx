import React, { useRef, useLayoutEffect, useState } from 'react';
import LoginUser from './pages/LoginUser';
import BrandSelect from './pages/BrandSelect';
import Home from './pages/Home';
import PointsStep1 from './pages/PointsStep1';
import PointsStep2 from './pages/PointsStep2';
import PointsStepFinal from './pages/PointsStepFinal';
import PosSelect from './pages/PosSelect';
import { Brand, Pos, fetchPos, authenticate } from './api/auth';
import { UserProfile } from './api/points';
import Spinner from './components/Spinner';
import Header from './components/Header';
import Footer from './components/Footer';

type Screen = 'loading' | 'login1' | 'login2' | 'home' | 'pos' | 'points1' | 'points2' | 'points3';

declare global {
  interface Window {
    awer: {
      ping: () => Promise<string>;
    };
  }
}

const App: React.FC = () => {
  const [screen, setScreen] = React.useState<Screen>('loading');
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [added, setAdded] = React.useState(0);
  const [expires, setExpires] = React.useState('');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  // Refs y estado para el padding dinámico
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [mainPadding, setMainPadding] = useState({ top: 0, bottom: 0 });


  useLayoutEffect(() => {
    const updatePadding = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      setMainPadding({ top: headerHeight, bottom: footerHeight });
    };
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  React.useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setScreen('login1');
        return;
      }
      const ok = await authenticate();
      if (!ok) {
        localStorage.removeItem('token');
        setScreen('login1');
        return;
      }
      const brand = localStorage.getItem('brand');
      if (!brand) {
        setScreen('login2');
        return;
      }
      const poses = await fetchPos(brand);
      const stored = localStorage.getItem('pos');
      localStorage.setItem('pos', stored || poses[0]?.name || 'Punto de Venta');
      setScreen('home');
    };
    init();
  }, []);

  const handleLogged = () => setScreen('login2');

  const handleBrand = (brand: Brand) => {
    localStorage.setItem('brand', brand.id);
    setScreen('loading');
    fetchPos(brand.id).then((poses) => {
      const stored = localStorage.getItem('pos');
      localStorage.setItem('pos', stored || poses[0]?.name || 'Punto de Venta');
      setScreen('home');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('brand');
    localStorage.removeItem('pos');
    setScreen('login1');
  };

  const handleChangeBrand = () => {
    localStorage.removeItem('brand');
    localStorage.removeItem('pos');
    setScreen('login2');
  };

  const handleChangePos = () => setScreen('pos');
  const handleStartPoints = () => setScreen('points1');

  const handleSelectPos = (pos: Pos) => {
    localStorage.setItem('pos', pos.name);
    setScreen('home');
  };

  const handleCancelPos = () => setScreen('home');

  const handlePointsNext1 = (p: UserProfile) => {
    setProfile(p);
    setScreen('points2');
  };
  const handlePointsNext2 = (p: UserProfile, a: number, e: string) => {
    setProfile(p);
    setAdded(a);
    setExpires(e);
    setScreen('points3');
  };
  const handleBackPoints1 = () => setScreen('home');
  const handleBackPoints2 = () => setScreen('points1');
  const handleBackPoints3 = () => setScreen('points2');
  const handleClosePoints = () => setScreen('home');

  if (screen === 'loading')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (screen === 'login1') return <LoginUser onLogin={handleLogged} />;
  if (screen === 'login2') return <BrandSelect onSelect={handleBrand} onLogout={handleLogout} />;

  let content: React.ReactNode = null;
  if (screen === 'home')
    content = <Home onChangePos={handleChangePos} onLoadPoints={handleStartPoints} />;
  else if (screen === 'pos')
    content = <PosSelect onSelect={handleSelectPos} onCancel={handleCancelPos} />;
  else if (screen === 'points1')
    content = <PointsStep1 onBack={handleBackPoints1} onNext={handlePointsNext1} />;
  else if (screen === 'points2' && profile)
    content = <PointsStep2 profile={profile} onBack={handleBackPoints2} onNext={handlePointsNext2} />;
  else if (screen === 'points3' && profile)
    content = (
      <PointsStepFinal
        profile={profile}
        added={added}
        expires={expires}
        onBack={handleBackPoints3}
        onClose={handleClosePoints}
      />
    );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header ref={headerRef} onChangeBrand={handleChangeBrand} onLogout={handleLogout} />
      <main
        className="flex-1 overflow-y-auto brand-scroll"
        style={{
          paddingTop: mainPadding.top,
          paddingBottom: mainPadding.bottom,
          maxHeight: `calc(100vh - ${mainPadding.top + mainPadding.bottom}px)`,
        }}
      >
        {content}
      </main>
      <Footer ref={footerRef} theme={theme} onToggle={toggleTheme} />
    </div>
  );
};

export default App;