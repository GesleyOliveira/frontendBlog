import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';

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

  if (articles.length === 0) return <p className="text-center py-10">Carregando artigos...</p>;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link
              to={`/articles/${article.id}`}
              key={article.id}
              className="group block border rounded-md shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`http://localhost:3000/uploads/${article.coverImage}`}
                alt="Capa do artigo"
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition">
                  {article.title.replace(/"/g, '')}
                </h2>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <img
                    src={
                      article.author.avatar
                        ? `http://localhost:3000/uploads/${article.author.avatar}`
                        : '/sem-foto.png'
                    }
                    alt="Autor"
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                  <span>
                    Por {article.author.name} –{' '}
                    {new Date(article.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
