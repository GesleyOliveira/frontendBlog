import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', String(data.user.id));
        localStorage.setItem('avatar', data.user.avatar || '');
        navigate('/home');
      } else {
        alert(data.message || 'Erro ao fazer login.');
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado esquerdo (logo + fundo escuro) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-black text-white w-1/2">
        <span className="text-7xl font-bold">M.</span>
        <p className="mt-4 text-sm">Inovação ao Seu Alcance.</p>
      </div>

      {/* Lado direito (formulário) */}
      <div className="flex flex-1 justify-center items-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-6">
          <h2 className="text-center text-xl font-semibold mb-6">Conectar</h2>

          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 mb-4 p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-black"
            required
          />

          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            placeholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-2 p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-black"
            required
          />

          <div className="text-right text-sm text-gray-500 mb-4">
            <Link to="/forgot-password">Esqueceu a senha?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Entrar
          </button>

          <div className="mt-6 text-center text-sm text-gray-700">
            Novo usuário? <Link to="/register" className="text-blue-600">Clique aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
