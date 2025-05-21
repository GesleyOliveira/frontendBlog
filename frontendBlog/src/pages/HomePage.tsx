import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

interface Article {
  id: number;
  title: string;
  coverImage: string;
  createdAt: string;
  author: {
    name: string;
    surname?: string;
    avatar?: string;
  };
}

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [liked, setLiked] = useState<number[]>(() => {
    const stored = localStorage.getItem('liked');
    return stored ? JSON.parse(stored) : [];
  });

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

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (articles.length === 0) return <p>Carregando artigos...</p>;

  const sortedArticles = [...articles].sort((a, b) => {
    const aLiked = liked.includes(a.id);
    const bLiked = liked.includes(b.id);
    if (aLiked === bLiked) return 0;
    return aLiked ? -1 : 1;
  });

  return (
    <div className="home-container">
      <Navbar />

      {sortedArticles.map((article) => (
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
                  Por {article.author.name}
                  {article.author.surname ? ` ${article.author.surname}` : ''} –{' '}
                  {new Date(article.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <Heart
                size={18}
                fill={liked.includes(article.id) ? 'red' : 'none'}
                stroke="red"
                onClick={(e) => {
                  e.preventDefault();
                  toggleLike(article.id);
                }}
                className="heart-icon"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
