import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

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
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch(() => alert('Erro ao carregar artigo.'));
  }, [id]);

  if (!article) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <img
            src={
              article.author.avatar
                ? `http://localhost:3000/uploads/${article.author.avatar}`
                : '/sem-foto.png'
            }
            alt="Autor"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-700 text-sm">
            Por {article.author.name} –{' '}
            {new Date(article.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {article.coverImage && (
          <img
            src={`http://localhost:3000/uploads/${article.coverImage}`}
            alt="Capa do artigo"
            className="w-full h-auto rounded mb-8"
          />
        )}

        <div className="text-gray-800 leading-relaxed space-y-6 text-justify">
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
