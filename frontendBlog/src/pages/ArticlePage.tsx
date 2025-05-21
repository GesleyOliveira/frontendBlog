import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ArticleCard } from '../components/ArticleCard';
import '../styles/article.css';

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
      <Navbar />
      
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          subtitle={
            article.content.length > 120
              ? article.content.slice(0, 120) + '...'
              : article.content
          }
          author={article.author.name}
          date={new Date(article.createdAt).toLocaleDateString('pt-BR')}
          image={`http://localhost:3000/uploads/${article.coverImage}`}
          linkTo={`/articles/${article.id}`}
        />
      ))}
    </div>
  );
}
