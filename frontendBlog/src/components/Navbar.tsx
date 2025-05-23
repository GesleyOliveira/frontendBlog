import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const avatarFromStorage = localStorage.getItem('avatar');
    if (avatarFromStorage) setAvatar(avatarFromStorage);

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
  }, [token]);

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
    localStorage.removeItem('avatar');
    navigate('/home');
  };

  const handleAvatarClick = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-extrabold tracking-tight text-black cursor-pointer" onClick={() => navigate('/home')}>
          M.
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-sm font-medium text-gray-800">
          <Link to="/home" className="hover:text-blue-600">Home</Link>
          <Link to="/articles" className="hover:text-blue-600">Artigos</Link>
          <span className="text-gray-400">|</span>

          {!token ? (
            <>
              <Link to="/login" className="hover:text-blue-600">Entrar</Link>
              <Link to="/register" className="bg-black text-white px-4 py-1 rounded hover:bg-gray-900 transition text-sm">
                Registrar
              </Link>
            </>
          ) : (
            <>
              <Link to="/articles/new" className="hover:text-blue-600">Publicar</Link>

              <div className="relative" ref={dropdownRef}>
                <img
                  src={avatar ? `http://localhost:3000/uploads/${avatar}` : '/sem-foto.png'}
                  onClick={handleAvatarClick}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer border-2 border-gray-300"
                  alt="Avatar"
                />

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md border border-gray-200 z-10">
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => navigate('/profile')}
                    >
                      Perfil
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                      onClick={handleLogout}
                    >
                      Desconectar
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
