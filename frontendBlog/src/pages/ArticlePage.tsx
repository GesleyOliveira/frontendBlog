import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Heart } from 'lucide-react';
import '../styles/home.css';

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

export function ArticlesPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/articles')
      .then((res) => res.json())
      .then(setArticles)
      .catch(() => alert('Erro ao carregar artigos.'));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('liked');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLiked(Array.isArray(parsed) ? parsed.map(Number) : []);
      } catch {
        setLiked([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);

  const toggleLike = (articleId: number) => {
    setLiked((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const selectedId = id ? parseInt(id) : null;
  const selectedArticle = selectedId
    ? articles.find((a) => a.id === selectedId)
    : null;

  const otherArticles = selectedId
    ? articles.filter((a) => a.id !== selectedId)
    : articles;

  return (
    <div className="home-container">
      <Navbar />

      {selectedArticle && (
        <div className="featured-article">
          <img
            src={`http://localhost:3000/uploads/${selectedArticle.coverImage}`}
            alt="Capa do artigo"
          />
          <h2>{selectedArticle.title}</h2>
          <p>{selectedArticle.content.slice(0, 120)}...</p>

          <div className="author-info">
            <div className="author-details">
              <img
                src={
                  selectedArticle.author.avatar
                    ? `http://localhost:3000/uploads/${selectedArticle.author.avatar}`
                    : '/sem-foto.png'
                }
                alt="Autor"
              />
              <span className="author-text">
                Por {selectedArticle.author.name} –{' '}
                {new Date(selectedArticle.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <Heart
              size={18}
              fill={liked.includes(selectedArticle.id) ? 'red' : 'none'}
              stroke="red"
              onClick={() => toggleLike(selectedArticle.id)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      {/* Lista dos outros artigos */}
      {otherArticles.map((article) => (
        <div key={article.id} className="featured-article">
          <img
            src={`http://localhost:3000/uploads/${article.coverImage}`}
            alt="Capa do artigo"
          />
          <h2>{article.title}</h2>
          <p>{article.content.slice(0, 120)}...</p>

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
                {new Date(article.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <Heart
              size={18}
              fill={liked.includes(article.id) ? 'red' : 'none'}
              stroke="red"
              onClick={() => toggleLike(article.id)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
