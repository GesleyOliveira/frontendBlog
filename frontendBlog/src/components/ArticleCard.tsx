import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import '../styles/articleCard.css';

interface ArticleCardProps {
  title: string;
  subtitle: string;
  author: {
    name: string;
    surname?: string;
    avatar?: string;
  };
  date: string;
  image: string;
  linkTo: string;
  liked: boolean;
  onToggleLike: () => void;
}

export function ArticleCard({
  title,
  subtitle,
  author,
  date,
  image,
  linkTo,
  liked,
  onToggleLike
}: ArticleCardProps) {
  return (
    <Link to={linkTo} className="article-card">
      <img src={image} alt="Capa do artigo" className="article-card-image" />

      <div className="article-card-content">
        <h3 className="article-card-title">{title}</h3>
        <p className="article-card-subtitle">{subtitle}</p>

        <div className="author-info">
          <div className="author-details">
            <img
              src={author.avatar ? `http://localhost:3000/uploads/${author.avatar}` : '/sem-foto.png'}
              alt="Autor"
            />
            <span className="author-text">
              Por {author.name}
              {author.surname ? ` ${author.surname}` : ''} – {date}
            </span>
          </div>
          <Heart
            size={18}
            fill={liked ? 'red' : 'none'}
            stroke="red"
            onClick={(e) => {
              e.preventDefault();
              onToggleLike();
            }}
            className="heart-icon"
          />
        </div>
      </div>
    </Link>
  );
}
