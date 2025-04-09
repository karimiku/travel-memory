import React, { useEffect, useState } from "react";
import "../css/AuthForm.css";
import GoogleLoginButton from "../component/GoogleLoginButton";

const AuthForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.id = "AuthForm";
  }, []);

  return (
    <div className="auth-wrapper">
      <main className="auth-main">
        <div className="auth-info">
          <h1 className="app-title highlight-title">
            <span className="colored-word">思い出</span>が
            <span className="colored-word">彩る</span>
            <br />
            あなただけの旅マップ。
          </h1>

          <p className="app-description">
            <span className="animated-line line1">
              大切な旅の記録を、もっと素敵に残しませんか？
            </span>
            <br />
            <span className="animated-line line2">
              行った場所を簡単に登録し、写真とコメントで思い出を振り返ろう。
            </span>
            <br />
            <span className="animated-line line3">
              地図を見返すだけでワクワクする、あなただけのアルバムを作りましょう。
            </span>
          </p>

          <p
            className="app-description animated-line line4"
            style={{ animationDelay: "0.8s" }}
          >
            「ここはどんな思い出だったっけ？」なんて忘れてしまう前に、
            <br />
            ほんの数秒で記録完了！
            <br />
            <strong>旅行好きやおでかけ好き</strong>なら必須のツールです。
          </p>

          <ul className="features">
            <li>🗾 都道府県を地図上で色分け</li>
            <li>📸 写真とコメントで思い出を残す</li>
            <li>🔒 Googleログインで安心・簡単</li>
          </ul>

          <div className="login-button-wrapper">
            <button className="start-button" onClick={() => setShowModal(true)}>
              無料ではじめる
            </button>
          </div>
        </div>

        {/* モーダル表示 */}
        {showModal && (
          <div className="login-modal">
            <div className="login-modal-content">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h3>ログイン・新規登録</h3>
              <p>Googleアカウントでログインして、サービスをはじめよう。</p>
              <GoogleLoginButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthForm;
