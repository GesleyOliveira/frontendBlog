// src/pages/ArticleDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import '../styles/articleDetail.css';

interface Author {
  name: string;
  avatar?: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  author: Author;
}

export function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/articles/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data))
      .catch(() => alert('Erro ao carregar artigo.'));
  }, [id]);

  if (!article) return <div>Carregando...</div>;

  return (
    <div className="article-detail-container">
      <Navbar />
      <div className="article-detail-content">
        <h1>{article.title}</h1>

        <div className="author-info">
          <img
            src={article.author.avatar
              ? `http://localhost:3000/uploads/${article.author.avatar}`
              : '/sem-foto.png'}
            alt="Autor"
          />
          <span>
            Por {article.author.name} –{' '}
            {new Date(article.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {article.coverImage && (
          <img
            className="cover-full"
            src={`http://localhost:3000/uploads/${article.coverImage}`}
            alt="Capa do artigo"
          />
        )}

        <p className="content">{article.content}</p>
      </div>
    </div>
  );
}
