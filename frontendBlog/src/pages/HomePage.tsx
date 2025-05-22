import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/home.css';

interface Article {
  id: number;
  title: string;
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

  return (
    <div className="home-container">
        <Navbar />
      {articles.map((article) => (
        <Link
          to={`/articles/${article.id}`}
          key={article.id}
          className="featured-article"
        >
          <div className="featured-article-content">
            <img
              src={`http://localhost:3000/uploads/${article.coverImage}`}
              alt="Capa do artigo"
            />
            <h2>{article.title.replace(/"/g, '')}</h2>
            <div className="author-info">
              <div className="author-details">
                <img
                  src={
                    article.author.avatar
                      ? `http://localhost:3000/uploads/${article.author.avatar}`
                      : '/sem-foto.png'
                  }
                  alt="Autor"
                />
                <span className="author-text">
                  Por {article.author.name} –{' '}
                  {new Date(article.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
