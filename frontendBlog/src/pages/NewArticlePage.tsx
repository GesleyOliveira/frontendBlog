import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Novo Artigo</h2>
        <div className="space-x-2">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => navigate('/articles')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Adicione um título"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Inserir imagem</label>
            <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer w-fit mb-2">
              Selecionar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="w-full md:w-60 h-40 flex items-center justify-center bg-gray-100 border rounded">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-full object-contain" />
            ) : (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Texto</label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu artigo"
            className="w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      </form>
    </div>
  );
}
