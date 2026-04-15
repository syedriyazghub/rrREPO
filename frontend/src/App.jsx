import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GuestForm from './pages/GuestForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [adminNames, setAdminNames] = useState(null); // array e.g. ['Riyaz'] or ['Vaseem','Ruksana']
  const navigate = useNavigate();

  const handleLogin = (names) => {
    setAdminNames(names);
    setShowLogin(false);
    navigate('/admin');
  };

  const handleLogout = () => {
    setAdminNames(null);
    navigate('/');
  };

  const handleAdminClick = () => {
    if (adminNames) navigate('/admin');
    else setShowLogin(true);
  };

  const adminLabel = adminNames ? adminNames.join(' & ') : 'Admin';

  return (
    <>
      <header className="header">
        <div>
          <h1>Roshan & Ruksana Wedding Celebrations</h1>
          <p>Confirm your RSVP for our special events</p>
        </div>
        <button className="btn-admin btn" onClick={handleAdminClick}>
          {adminNames ? adminLabel : 'Admin'}
        </button>
      </header>

      {showLogin && <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />}

      <Routes>
        <Route path="/" element={<GuestForm />} />
        <Route
          path="/admin"
          element={
            adminNames
              ? <AdminDashboard adminNames={adminNames} onLogout={handleLogout} />
              : <GuestForm />
          }
        />
      </Routes>
    </>
  );
}
