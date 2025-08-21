import React from 'react';
import LoginUser from './pages/LoginUser';
import BrandSelect from './pages/BrandSelect';
import Home from './pages/Home';
import { Brand } from './api/mock';

type Screen = 'login1' | 'login2' | 'home';

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
    localStorage.setItem('pos', `${brand.name} 1`);
    setScreen('home');
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

  if (screen === 'login1') return <LoginUser onLogin={handleLogged} />;
  if (screen === 'login2') return <BrandSelect onSelect={handleBrand} onLogout={handleLogout} />;
  return <Home onChangeBrand={handleChangeBrand} onLogout={handleLogout} />;
};

export default App;
