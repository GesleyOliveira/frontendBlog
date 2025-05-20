import { ArticleCard } from '../components/ArticleCard';
import '../styles/home.css';

const mockArticles = [
  {
    title: 'Desvendando o JavaScript: Dicas e Técnicas Essenciais',
    subtitle: 'Neste artigo, exploramos estratégias modernas para desenvolvedores JavaScript.',
    author: 'John Doe',
    date: 'Março 20, 2025',
    image: 'https://via.placeholder.com/600x300?text=JS',
  },
  {
    title: 'Dominando TypeScript: Por que a Tipagem Estática Está Transformando o Desenvolvimento',
    subtitle: 'TypeScript tem se tornado popular entre desenvolvedores por sua segurança.',
    author: 'Mary Smith',
    date: 'Março 20, 2025',
    image: 'https://via.placeholder.com/600x300?text=TS',
  }
];

export function HomePage() {
  return (
    <div className="home-container">
      {mockArticles.map((article, index) => (
        <ArticleCard key={index} {...article} />
      ))}
    </div>
  );
}
