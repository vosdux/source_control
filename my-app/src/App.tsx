import React, { FC } from 'react';
import { useRouter } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { getCookie } from './helpers/getCokie';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

const App: FC = () => {
  const { token, login, logout } = useAuth();
  const isAuthinticated = !!token;
  const routes = useRouter(isAuthinticated);
  return (
    <AuthContext.Provider value={{token, login, logout}}>
      <BrowserRouter>
        <div className="container h-100">
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
