import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Heart, Pencil } from 'lucide-react';
import axios from 'axios';

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

  useEffect(() => {
    fetch('http://localhost:3000/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allArticles.map(article => {
          const isAuthor = isLoggedIn && article.author.id === currentUserId;

          return (
            <div
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3000/uploads/${article.coverImage}`}
                alt="Capa do artigo"
                className="h-48 w-full object-cover"
              />

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-600">{article.content.slice(0, 120)}...</p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <img
                      src={
                        article.author.avatar
                          ? `http://localhost:3000/uploads/${article.author.avatar}`
                          : '/sem-foto.png'
                      }
                      alt="Autor"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>
                      Por {article.author.name} –{' '}
                      {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Heart
                      size={18}
                      fill={liked.includes(article.id) ? 'red' : 'none'}
                      stroke="red"
                      onClick={e => {
                        e.stopPropagation();
                        toggleLike(article.id);
                      }}
                      className="hover:scale-110 transition"
                    />
                    {isAuthor && (
                      <div className="relative">
                        <Pencil
                          size={18}
                          onClick={e => {
                            e.stopPropagation();
                            setDropdownOpenId(prev => (prev === article.id ? null : article.id));
                          }}
                          className="hover:scale-110 transition"
                        />
                        {dropdownOpenId === article.id && (
                          <div
                            className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              className="block w-full px-3 py-1 text-sm hover:bg-gray-100"
                              onClick={() => navigate(`/articles/edit/${article.id}`)}
                            >
                              Editar
                            </button>
                            <button
                              className="block w-full px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(article.id)}
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
            </div>
          );
        })}
      </main>
    </div>
  );
}
