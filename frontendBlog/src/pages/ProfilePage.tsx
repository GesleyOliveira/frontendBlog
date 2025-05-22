import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/profile.css';

export function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('/sem-foto.png');

  const token = localStorage.getItem('token');

  const fetchProfile = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Não autorizado');

      const data = await res.json();
      setName(data.name || '');
      setSurname(data.surname || '');
      setEmail(data.email || '');
      setPreview(data.avatar ? `http://localhost:3000/uploads/${data.avatar}` : '/sem-foto.png');
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return alert('Você precisa estar logado.');
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

      const res = await axios.put<{ avatar?: string }>(
        'http://localhost:3000/users/update-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.avatar) {
        localStorage.setItem('avatar', res.data.avatar);
        setPreview(`http://localhost:3000/uploads/${res.data.avatar}`);
      }

      await fetchProfile();
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-header">
          <div className="form-left">
            <h2>Editar Perfil</h2>

            <label>Inserir avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <br />

            <label>Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Sobrenome</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />

            <label>Email</label>
            <input type="email" value={email} disabled readOnly />

            <label>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="actions">
              <button type="button" onClick={() => navigate('/')}>Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </div>

          <div className="form-right">
            <img
              src={preview}
              alt="Preview do avatar"
              className="avatar-preview"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
