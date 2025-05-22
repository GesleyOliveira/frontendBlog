import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import axios from 'axios';

export function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const token = localStorage.getItem('token');

  // 🔄 Carrega o perfil do usuário
  const fetchProfile = async () => {
    if (!token) return navigate('/login');

    try {
      const res = await fetch('http://localhost:3000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Não autorizado');

      const data = await res.json();
      setName(data.name);
      setSurname(data.surname || '');
      setEmail(data.email);
      setAvatar(data.avatar);
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Você precisa estar logado para atualizar seu perfil.');
      return;
    }

    if (password && password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      if (password) formData.append('password', password);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await axios.put(
        'http://localhost:3000/users/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Atualiza avatar localmente se backend retornar novo nome
      if (res.data?.avatar) setAvatar(res.data.avatar);

      await fetchProfile();
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={avatar ? `http://localhost:3000/uploads/${avatar}` : '/sem-foto.png'}
          className="profile-avatar"
          alt="Avatar"
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Sobrenome</label>
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

        <div className="profile-divider" />

        <label>Email</label>
        <input type="email" value={email} readOnly disabled />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirmar Senha</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="profile-button" type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
}
