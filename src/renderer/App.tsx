import React from 'react';
import LoginUser from './pages/LoginUser';
import BrandSelect from './pages/BrandSelect';
import Home from './pages/Home';
import PointsStep1 from './pages/PointsStep1';
import PointsStep2 from './pages/PointsStep2';
import PointsStepFinal from './pages/PointsStepFinal';

import PosSelect from './pages/PosSelect';
import { Brand, Pos, mockFetchPos, UserProfile } from './api/mock';

type Screen = 'login1' | 'login2' | 'home' | 'pos' | 'points1' | 'points2' | 'points3';


declare global {
  interface Window {
    awer: {
      ping: () => Promise<string>;
    };
  }
}

const App: React.FC = () => {
  const [screen, setScreen] = React.useState<Screen>('login1');
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [added, setAdded] = React.useState(0);
  const [expires, setExpires] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const brand = localStorage.getItem('brand');
    if (!token) setScreen('login1');
    else if (!brand) setScreen('login2');
    else setScreen('home');
  }, []);

  const handleLogged = () => setScreen('login2');

  const handleBrand = (brand: Brand) => {
    localStorage.setItem('brand', brand.id);

    mockFetchPos(brand.id).then((poses) => {
      localStorage.setItem('pos', poses[0]?.name || 'Punto de Venta');
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

  if (screen === 'login1') return <LoginUser onLogin={handleLogged} />;
  if (screen === 'login2') return <BrandSelect onSelect={handleBrand} onLogout={handleLogout} />;
  if (screen === 'pos') return <PosSelect onSelect={handleSelectPos} onCancel={handleCancelPos} />;
  if (screen === 'points1') return <PointsStep1 onBack={handleBackPoints1} onNext={handlePointsNext1} />;
  if (screen === 'points2' && profile)
    return <PointsStep2 profile={profile} onBack={handleBackPoints2} onNext={handlePointsNext2} />;
  if (screen === 'points3' && profile)
    return (
      <PointsStepFinal
        profile={profile}
        added={added}
        expires={expires}
        onBack={handleBackPoints3}
        onClose={handleClosePoints}
      />
    );
  return (
    <Home
      onChangeBrand={handleChangeBrand}
      onLogout={handleLogout}
      onChangePos={handleChangePos}
      onLoadPoints={handleStartPoints}
    />
  );

};

export default App;
