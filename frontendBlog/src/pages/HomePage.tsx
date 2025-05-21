import { useEffect, useState } from 'react';
import '../styles/home.css';

interface Article {
  id: number;
  title: string;
  content: string;
  coverImage: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('http://localhost:3000/articles');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error('Erro ao buscar artigos:', err);
      }
    };

    fetchArticles();
  }, []);

  if (articles.length === 0) return <p>Carregando artigos...</p>;

  const [featured, ...newArticles] = articles;

  return (
    <div className="home-container">
      <div className="featured-article">
        <img
          src={`http://localhost:3000/uploads/${featured.coverImage}`}
          alt="Capa do artigo"
        />
        <h2>{featured.title}</h2>
        <p>{featured.content.slice(0, 100)}...</p>
        <div className="author-info">
          <img
            src={
              featured.author.avatar
                ? `http://localhost:3000/uploads/${featured.author.avatar}`
                : '/sem-foto.png'
            }
            alt="Autor"
          />
          <span>
            Por {featured.author.name} •{' '}
            {new Date(featured.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="section-new">
        <h3>New</h3>
        {newArticles.map((article) => (
          <div key={article.id} className="section-new-article">
            <strong>{article.title}</strong>
            <p>{article.content.slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
