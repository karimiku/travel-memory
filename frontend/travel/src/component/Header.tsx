import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header: FC = () => {
  const navigate = useNavigate();

  const handleMain = () => {
    navigate("/main");
  };

  const handleAllMemories = () => {
    navigate("/allMemories");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="header">
      <h1 className="header-title">〜旅行のMemory〜</h1>
      <nav className="header-nav">
        <button className="nav-button" onClick={handleMain}>
          ホーム
        </button>
        <button className="nav-button" onClick={handleAllMemories}>
          思い出
        </button>
        <button className="nav-button" onClick={handleLogout}>
          ログアウト
        </button>
      </nav>
    </header>
  );
};

export default Header;
