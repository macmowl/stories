import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { fetchUser } from './utils/fetchUser';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (!user) {
      navigate('/login');
    }
  }, []);

  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
  );
}

export default App;
