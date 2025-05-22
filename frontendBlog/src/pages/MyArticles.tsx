import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/myArticles.css';

interface Article {
  id: number;
  title: string;
  content: string;
  coverImage: string;
  createdAt: string;
}

export function MyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const res = await axios.get<Article[]>('http://localhost:3000/articles/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(res.data);
      } catch (err) {
        console.error('Erro ao buscar seus artigos:', err);
      }
    };

    fetchMyArticles();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja mesmo excluir este artigo?')) return;

    try {
      await axios.delete(`http://localhost:3000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao excluir artigo:', err);
    }
  };

  const handleEdit = (id: number) => {
    window.location.href = `/articles/edit/${id}`;
  };

  return (
    <div className="my-articles-container">
      {articles.map(article => (
        <div key={article.id} className="article-card">
          <img
            src={`http://localhost:3000/uploads/${article.coverImage}`}
            alt={article.title}
            className="cover"
          />
          <div className="content">
            <h3>{article.title}</h3>
            <p>{article.content.slice(0, 120)}...</p>
            <div className="footer">
              <span>Publicado em {new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
              <div className="actions">
                <button onClick={() => handleEdit(article.id)}>Editar</button>
                <button onClick={() => handleDelete(article.id)}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
