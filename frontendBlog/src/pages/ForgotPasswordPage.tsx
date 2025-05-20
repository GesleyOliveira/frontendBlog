import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from '../components/FormContainer';
import '../styles/forgot-password.css';

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
    <FormContainer>
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Esqueci a senha</h2>
        <p>Sem problemas! Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>

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

        <p className="back-login">
          Lembrou a senha? <a href="/login">Voltar ao login</a>
        </p>
      </form>
    </FormContainer>
  );
}
