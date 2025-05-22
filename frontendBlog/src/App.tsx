// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { ArticlesPage } from './pages/ArticlePage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyArticles } from './pages/MyArticles';
// import { NewArticlePage } from './pages/NewArticlePage';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/articles"
        element={
          <PrivateRoute>
            <ArticlesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/articles/:id"
        element={
          <PrivateRoute>
            <ArticlesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-articles"
        element={
          <PrivateRoute>
            <MyArticles />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
