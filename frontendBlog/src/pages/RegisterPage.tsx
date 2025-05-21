import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/global.css'; 

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
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-title">
          <ArrowLeft className="back-icon" onClick={() => navigate('/login')} />
          <h2>Registrar</h2>
        </div>
        <p>
          Crie sua conta para explorar conteúdos incríveis, seguir autores e participar da comunidade.
        </p>

         <input
          type="text"
          placeholder="Nome"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Criar conta</button>

        <div className="auth-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            Li e concordo com os Termos de Uso e a Política de Privacidade.
          </label>
        </div>

        <div className="auth-footer">
          <span>Já tem cadastro? </span>
          <Link to="/login">Clique aqui</Link>
        </div>
      </form>
    </div>
  );
}
