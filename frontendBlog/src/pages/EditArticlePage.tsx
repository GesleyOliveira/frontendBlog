import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/newArticle.css';

interface Article {
  title: string;
  content: string;
  coverImage: string;
}

export function EditArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get<Article>(`http://localhost:3000/articles/${id}`);
        const article = res.data;
        setTitle(article.title);
        setContent(article.content);
        setPreview(`http://localhost:3000/uploads/${article.coverImage}`);
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        alert('Erro ao carregar o artigo.');
        navigate('/articles');
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Você precisa estar logado.');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('coverImage', image);

      await axios.put(`http://localhost:3000/articles/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Artigo atualizado com sucesso!');
      navigate('/articles');
    } catch (err) {
      console.error('Erro ao atualizar artigo:', err);
      alert('Erro ao atualizar artigo.');
    }
  };

  return (
    <div className="new-article-container">
      <div className="new-article-header">
        <h2>Editar Artigo</h2>
        <div className="actions">
          <button className="cancel" onClick={() => navigate('/articles')}>Cancelar</button>
          <button className="save" onClick={handleSubmit}>Salvar</button>
        </div>
      </div>

      <form className="new-article-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Inserir imagem</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <label>Texto</label>
        <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
      </form>
    </div>
  );
}
