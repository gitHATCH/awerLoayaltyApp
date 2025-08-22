import React from 'react';
import LoginUser from './pages/LoginUser';
import BrandSelect from './pages/BrandSelect';
import Home from './pages/Home';
import PosSelect from './pages/PosSelect';
import { Brand, Pos, mockFetchPos } from './api/mock';

type Screen = 'login1' | 'login2' | 'home' | 'pos';

declare global {
  interface Window {
    awer: {
      ping: () => Promise<string>;
    };
  }
}

const App: React.FC = () => {
  const [screen, setScreen] = React.useState<Screen>('login1');

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

  const handleSelectPos = (pos: Pos) => {
    localStorage.setItem('pos', pos.name);
    setScreen('home');
  };

  const handleCancelPos = () => setScreen('home');

  if (screen === 'login1') return <LoginUser onLogin={handleLogged} />;
  if (screen === 'login2') return <BrandSelect onSelect={handleBrand} onLogout={handleLogout} />;
  if (screen === 'pos') return <PosSelect onSelect={handleSelectPos} onCancel={handleCancelPos} />;
  return <Home onChangeBrand={handleChangeBrand} onLogout={handleLogout} onChangePos={handleChangePos} />;
};

export default App;
