import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { NewArticlePage } from './pages/NewArticlePage';
import { EditArticlePage } from './pages/EditArticlePage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />

      <Route path="/articles" element={<ArticlesPage />} />

      <Route
        path="/articles/new"
        element={
          <PrivateRoute>
            <NewArticlePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/articles/edit/:id"
        element={
          <PrivateRoute>
            <EditArticlePage />
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
