import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/users/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Senha redefinida com sucesso!');
        navigate('/login');
      } else {
        alert(data.message || 'Erro ao redefinir senha.');
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo com fundo escuro e logo */}
      <div className="w-1/2 bg-black text-white hidden lg:flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold">M.</h1>
          <p className="mt-2 text-sm">Inovação ao Seu Alcance.</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4"
        >
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-600 hover:text-black mb-2"
          >
            <ArrowLeft className="mr-2" size={18} />
            Voltar ao login
          </button>

          <h2 className="text-2xl font-semibold">Esqueci a senha</h2>
          <p className="text-gray-600 text-sm">
            Informe seu e-mail e redefina sua senha.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Alterar
          </button>

          <div className="text-center text-sm mt-2">
            <Link to="/login" className="text-blue-600 hover:underline">
              Voltar ao login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
