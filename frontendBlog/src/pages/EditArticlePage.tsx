import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Editar Artigo</h2>
        <div className="space-x-2">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => navigate('/articles')}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Inserir imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs h-auto border rounded"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Texto</label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      </form>
    </div>
  );
}
