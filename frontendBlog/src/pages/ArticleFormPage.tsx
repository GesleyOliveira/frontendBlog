import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import '../styles/article-form.css';

export function ArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [coverName, setCoverName] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:3000/articles/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setPreviewImage(`http://localhost:3000/uploads/${data.coverImage}`);
          setCoverName(data.coverImage);
        });
    }
  }, [id, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setCoverName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (coverImage) formData.append('coverImage', coverImage);

    const res = await fetch(`http://localhost:3000/articles/${id || ''}`, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert('Artigo salvo com sucesso!');
      navigate('/articles');
    } else {
      alert('Erro ao salvar artigo.');
    }
  };

  return (
    <div className="article-form-container">
      <Navbar />
      
      <h2>{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h2>
      <form onSubmit={handleSubmit} className="article-form">
        <label className="banner-preview">
          <img src={previewImage || 'https://via.placeholder.com/120x120?text=TS'} alt="banner" />
          <span>Banner</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {coverName && <input value={coverName} disabled />}
        </label>

        <input
          type="text"
          placeholder="Adicione um título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Escreva seu artigo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        ></textarea>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}