import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAvatar(data.avatar);
      } catch (err) {
        console.error('Erro ao carregar avatar:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    navigate('/settings');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home">Home</Link>
        <Link to="/articles">Artigos</Link>
      </div>
      <div className="navbar-right">
        <img
          src={
            avatar
              ? `http://localhost:3000/uploads/${avatar}`
              : '/sem-foto.png'
          }
          alt="avatar"
          className="navbar-avatar"
          onClick={handleAvatarClick}
        />
      </div>
    </nav>
  );
}
