import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'
import '../styles/global.css';


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
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-title">
          <ArrowLeft className="back-icon" onClick={() => navigate('/login')} />
          <h2>Esqueci a senha</h2>
        </div>
        <p>Sem problemas! Informe seu e-mail e enviaremos um link para redefinir sua senha</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Alterar</button>

        <div className="auth-footer">
          Lembrou a senha? <Link to="/login">Voltar ao login</Link>
        </div>
      </form>
    </div>
  );
}
