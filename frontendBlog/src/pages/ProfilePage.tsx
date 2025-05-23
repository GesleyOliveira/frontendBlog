import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';

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
    <div className="min-h-screen bg-white">
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row justify-between max-w-5xl mx-auto gap-8 px-4 py-10"
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-6">Editar Perfil</h2>

          <label className="block mb-1 font-medium">Inserir avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block mb-4 border border-gray-300 rounded px-3 py-2 w-full"
          />

          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block mb-4 border border-gray-300 rounded px-3 py-2 w-full"
          />

          <label className="block mb-1 font-medium">Sobrenome</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="block mb-4 border border-gray-300 rounded px-3 py-2 w-full"
          />

          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            readOnly
            className="block mb-4 border border-gray-200 bg-gray-100 text-gray-500 rounded px-3 py-2 w-full"
          />

          <label className="block mb-1 font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block mb-4 border border-gray-300 rounded px-3 py-2 w-full"
          />

          <label className="block mb-1 font-medium">Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block mb-6 border border-gray-300 rounded px-3 py-2 w-full"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="w-full lg:w-60">
          <img
            src={preview}
            alt="Preview do avatar"
            className="rounded w-full object-cover"
          />
        </div>
      </form>
    </div>
  );
}
