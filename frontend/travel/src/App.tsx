import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Loading from './pages/Loading';
import OAuth2Redirect from './pages/oauth2/redirect';
import MemoryDetail from './pages/MemoryDetail';
import { JSX } from 'react';
import Main from './pages/Main';

// PrivateRoute コンポーネント（トークンがなければリダイレクト）
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* AuthForm（ログイン/新規登録の切り替え） */}
        <Route path="/" element={<AuthForm />} />

        {/* OAuth2 リダイレクト */}
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

        {/* ログイン後の画面 */}
        <Route path="/main" element={<PrivateRoute element={<Main />} />} />

        {/* その他はすべてルートへ */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* ローディング画面 */}
        <Route path="/loading" element={<Loading />} />
        {/* メモリー詳細画面 */}
        <Route path="/memories/:id" element={<MemoryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;