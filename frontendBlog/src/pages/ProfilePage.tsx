import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import '../styles/profile.css';

interface UserProfile {
  name: string;
  surname: string;
  email: string;
  avatar: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>({
    name: '',
    surname: '',
    email: '',
    avatar: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch('http://localhost:3000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        alert('Erro ao carregar perfil.');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:3000/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        surname: user.surname,
        password,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Perfil atualizado com sucesso!');
    } else {
      alert(data.message || 'Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      
      <div className="profile-header">
        <span className="profile-back" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </span>
        <h2>Perfil</h2>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-header">
          <img
            src={`http://localhost:3000/uploads/${user.avatar}`}
            alt="avatar"
            className="profile-avatar"
          />
          <input
            className="profile-avatar-input"
            value={user.avatar}
            disabled
          />
        </div>

        <div>
          <label>Nome</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Sobrenome</label>
          <input
            type="text"
            value={user.surname}
            onChange={(e) => setUser({ ...user, surname: e.target.value })}
            required
          />
        </div>

        <div className="profile-divider" />

        <div>
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="profile-button">
          Salvar
        </button>
      </form>
    </div>
  );
}
