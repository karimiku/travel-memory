import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Loading from "./pages/Loading";
import OAuth2Redirect from "./pages/oauth2/redirect";
import MemoryDetail from "./pages/MemoryDetail";
import AllMemories from "./pages/AllMemories";
import Main from "./pages/Main";
import { JSX } from "react";
import { MemoryProvider } from "./context/MemoryContext";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" replace />;
};

const OnlyGuestRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/main" replace /> : children;
};

const App: React.FC = () => {
  return (
    <MemoryProvider>
      <Router>
        <Routes>
          {/* ログイン系 */}
          <Route
            path="/"
            element={
              <OnlyGuestRoute>
                <AuthForm />
              </OnlyGuestRoute>
            }
          />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

          {/* ログイン後の画面 */}
          <Route path="/main" element={<PrivateRoute element={<Main />} />} />
          <Route
            path="/memories/:id"
            element={<PrivateRoute element={<MemoryDetail />} />}
          />
          <Route
            path="/allMemories"
            element={<PrivateRoute element={<AllMemories />} />}
          />

          {/* ローディング画面 */}
          <Route path="/loading" element={<Loading />} />

          {/* その他は全部トップに */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MemoryProvider>
  );
};

export default App;
