import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const checkbox = document.getElementById('terms') as HTMLInputElement;

    if (!email.trim()) {
      alert('O campo de e-mail é obrigatório.');
    } else if (!password.trim()) {
      alert('O campo de senha é obrigatório.');
    } else if (!confirmPassword.trim()) {
      alert('Confirme sua senha.');
    } else if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
    } else if (!checkbox?.checked) {
      alert('Você deve aceitar os Termos de Uso e Política de Privacidade.');
    } else {
      try {
        const res = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert('Usuário registrado com sucesso!');
          navigate('/login');
        } else {
          alert(data.message || 'Erro ao registrar.');
        }
      } catch {
        alert('Erro de conexão com o servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-black text-white hidden lg:flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold">M.</h1>
          <p className="mt-2 text-sm">Inovação ao Seu Alcance.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <form
          className="w-full max-w-md space-y-4"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-600 hover:text-black mb-2"
          >
            <ArrowLeft className="mr-2" size={18} />
            Voltar ao login
          </button>

          <h2 className="text-2xl font-semibold">Registrar</h2>

          <input
            type="text"
            placeholder="Nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />

          <input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />

          <div className="flex items-start space-x-2 text-sm">
            <input id="terms" type="checkbox" required />
            <label htmlFor="terms" className="text-gray-600">
              Li e concordo com os{' '}
              <span className="underline cursor-pointer text-blue-600">
                Termos de Uso e Política de Privacidade
              </span>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            Criar conta
          </button>

          <div className="text-center text-sm">
            Já tem cadastro?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Clique aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
