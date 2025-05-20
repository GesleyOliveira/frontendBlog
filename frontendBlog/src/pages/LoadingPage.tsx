import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loading.css';

export function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/ogin');
    }, 1000); // 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      <h1 className="logo">M.</h1>
      <p className="subtitle">Conteúdo que inspira</p>
    </div>
  );
}
