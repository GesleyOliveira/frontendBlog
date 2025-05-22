import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Heart, Pencil } from 'lucide-react';
import axios from 'axios';
import '../styles/home.css';

interface Author {
  id: number;
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
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

  const token = localStorage.getItem('token');
  const currentUserId = Number(localStorage.getItem('user_id')) || 0;
  const isLoggedIn = Boolean(token);

  console.log('✅ CURRENT USER ID:', currentUserId);

  useEffect(() => {
    fetch('http://localhost:3000/articles')
      .then(res => res.json())
      .then(data => {
        console.log('📰 ARTICLES:', data);
        setArticles(data);
      })
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
    setLiked(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      await axios.delete(`http://localhost:3000/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao excluir artigo:', err);
    }
  };

  const selectedId = id ? parseInt(id) : null;
  const selectedArticle = selectedId ? articles.find(a => a.id === selectedId) : null;
  const otherArticles = selectedId ? articles.filter(a => a.id !== selectedId) : articles;

  const allArticles = [selectedArticle, ...otherArticles].filter(Boolean) as Article[];

  return (
    <div className="home-container">
      <Navbar />

      {allArticles.map(article => {
        const isAuthor = isLoggedIn && article.author.id === currentUserId;

        console.log(
          `🧩 ARTIGO ${article.id} - Autor: ${article.author.id}, Usuário atual: ${currentUserId} ${isAuthor ? '✅ (autor)' : '🚫'}`
        );

        return (
          <div
            key={article.id}
            className="featured-article"
            onClick={() => navigate(`/articles/${article.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={`http://localhost:3000/uploads/${article.coverImage}`} alt="Capa do artigo" />
            <h2>{article.title}</h2>
            <p>{article.content.slice(0, 120)}...</p>

            <div className="author-info">
              <div className="author-details">
                <img
                  src={article.author.avatar
                    ? `http://localhost:3000/uploads/${article.author.avatar}`
                    : '/sem-foto.png'}
                  alt="Autor"
                />
                <span className="author-text">
                  Por {article.author.name} – {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="article-actions">
                <Heart
                  size={18}
                  fill={liked.includes(article.id) ? 'red' : 'none'}
                  stroke="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(article.id);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                {isAuthor && (
                  <div className="edit-icon-wrapper">
                    <Pencil
                      size={18}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenId(article.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    {dropdownOpenId === article.id && (
                      <div className="dropdown-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/articles/edit/${article.id}`);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(article.id);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
