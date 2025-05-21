import { Link } from 'react-router-dom';
import '../styles/home.css';

interface ArticleProps {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  image: string;
  linkTo: string; 
}

export function ArticleCard({ title, subtitle, author, date, image, linkTo }: ArticleProps) {
  return (
    <Link to={linkTo} className="article-card">
      <img src={image} alt="Capa do artigo" className="article-image" />
      <h3 className="article-title">{title}</h3>
      <p className="article-subtitle">{subtitle}</p>
      <div className="article-meta">
        <span>Por {author}</span> · <span>{date}</span>
      </div>
    </Link>
  );
}
