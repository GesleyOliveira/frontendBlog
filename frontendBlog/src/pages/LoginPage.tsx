import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormContainer } from '../components/FormContainer';
import '../styles/login.css';

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
        navigate('/home');
      } else {
        alert(data.message || 'Erro ao fazer login.');
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Bem-vindo de volta!</h1>
        <p>Acesse sua conta para acompanhar artigos exclusivos, favoritar e muito mais.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="form-links">
          <Link to="/forgot-password">Esqueceu a senha?</Link>
        </div>

        <button type="submit">Login</button>

        <div className="form-footer">
          <span>Novo usuário? </span>
          <Link to="/register">Clique aqui</Link>
        </div>
      </form>
    </FormContainer>
  );
}
