import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export function SettingsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <span className="logo" onClick={() => navigate('/home')}>M.</span>
        <button className="close-button" onClick={() => navigate('/home')}>X</button>
      </div>

      <div className="settings-menu">
        <button onClick={() => navigate('/profile')}>Perfil</button>
        <button onClick={() => navigate('/MyArticles')}>Meus Artigos</button>
        <button onClick={() => navigate('/create-article')}>Criar novo Artigo</button>
      </div>

      <div className="settings-footer">
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
