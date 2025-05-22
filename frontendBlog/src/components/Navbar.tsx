import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../styles/navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    const avatarFromStorage = localStorage.getItem('avatar');
    if (avatarFromStorage) setAvatar(avatarFromStorage);

    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        setAvatar(data.avatar);
        localStorage.setItem('avatar', data.avatar); 
      } catch (err) {
        console.error('Erro ao carregar avatar:', err);
      }
    };

    fetchProfile();
  }, []);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/home');
  };

  const handleAvatarClick = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-logo">M.</span>
        </div>
        <div className="navbar-right">
          <Link to="/home">Home</Link>
          <Link to="/articles">Artigos</Link>
          <span className="separator">|</span>

          {!token ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register" className="register-button">Registrar</Link>
            </>
          ) : (
            <>
              <Link to="/articles/new">Publicar</Link>
              <div className="avatar-dropdown" ref={dropdownRef}>
                <img
                  src={avatar ? `http://localhost:3000/uploads/${avatar}` : '/sem-foto.png'}
                  className="navbar-avatar"
                  onClick={handleAvatarClick}
                  alt="Avatar"
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate('/profile')}>Perfil</button>
                    <button onClick={handleLogout}>Desconectar</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
