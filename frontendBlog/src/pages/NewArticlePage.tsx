import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/newArticle.css';

export function NewArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Você precisa estar logado.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('coverImage', image);

    console.log([...formData.entries()]);


    try {
      await axios.post('http://localhost:3000/articles', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/articles');
    } catch (err) {
      console.error('Erro ao criar artigo:', err);
      alert('Erro ao criar artigo.');
    }
  };

  return (
    <div className="new-article-container">
      <div className="new-article-header">
        <h2>Novo Artigo</h2>
        <div className="actions">
          <button className="cancel" onClick={() => navigate('/articles')}>Cancelar</button>
          <button className="save" onClick={handleSubmit}>Salvar</button>
        </div>
      </div>

      <form className="new-article-form" onSubmit={handleSubmit}>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Adicione um título"
        />

        <label>Inserir imagem</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="Preview" className="preview-image" />
        )}

        <label>Texto</label>
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva seu artigo"
        />
      </form>
    </div>
  );
}
