// src/pages/ArticlesPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

interface Author {
  name: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  author: Author;
  createdAt: string;
}

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/articles')
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => alert('Erro ao carregar artigos.'));
  }, []);

  return (
    <div className="home-container">
      {articles.map((article) => (
        <Link to={`/articles/${article.id}`} key={article.id} className="article-card">
          {article.coverImage && (
            <img
              src={`http://localhost:3000/uploads/${article.coverImage}`}
              alt="Capa"
              className="article-image"
            />
          )}
          <h3 className="article-title">{article.title}</h3>
          <p className="article-subtitle">
            {article.content.length > 120 ? article.content.slice(0, 120) + '...' : article.content}
          </p>
          <div className="article-meta">
            <span>Por {article.author.name}</span> ·{' '}
            <span>{new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
