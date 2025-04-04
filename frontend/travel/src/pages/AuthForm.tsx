import React, { useState, useEffect } from 'react';
import '../css/AuthForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../component/GoogleLoginButton';
import axiosClient from '../lib/axiosClient';

const AuthForm: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.id = 'auth';
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/login', {
                email: loginEmail,
                password: loginPassword,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            console.log('ログイン成功', token);
            navigate('/loading');
        } catch (error: any) {
            console.error('ログイン失敗', error);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // baseURLを考慮してエンドポイントを調整
            const response = await axiosClient.post('/signup', {
                email: signupEmail,
                password: signupPassword
            }, {
                // 明示的なヘッダー設定
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log(response.data);
            alert('登録完了しました！ログインしてください。');
            // 登録後、ログインページへ遷移（React Routerなど使用）
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                // Axios特有のエラー処理
                if (error.response) {
                    // サーバーからのエラーレスポンス
                    console.error("エラーの詳細:", error.response.data);
                    alert(`登録失敗: ${error.response.data.message || '不明なエラー'}`);
                } else if (error.request) {
                    // リクエストは送信されたがレスポンスなし
                    console.error("レスポンスなし:", error.request);
                    alert("サーバーからの応答がありません。");
                } else {
                    // リクエスト設定中のエラー
                    console.error("エラー:", error.message);
                    alert("エラーが発生しました。");
                }
            } else {
                // Axios以外の一般的なエラー
                console.error("予期せぬエラー:", error);
                alert("予期せぬエラーが発生しました。");
            }
        }
    };


    return (
        <div className="auth-form-wrapper">
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1>アカウント作成</h1>
                        <span>or use your email for registration</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                        />

                        <button className="auth" type="submit">サインアップ</button>
                        <GoogleLoginButton />
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1>サインイン</h1>
                        <span>or use your account</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <button type="submit">サインイン</button>
                        <GoogleLoginButton />
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Sign In!</h1>
                            <p></p>
                            <button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Sign Up!</h1>
                            <p>アカウント作成がまだの方</p>
                            <button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
