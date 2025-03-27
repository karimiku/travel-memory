import React, { useState } from 'react';
import axios from 'axios';

// axiosのグローバル設定を追加
axios.defaults.baseURL = 'http://localhost:8080/auth';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // baseURLを考慮してエンドポイントを調整
            const response = await axios.post('/signup', {
                email,
                password
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
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">新規登録</button>
        </form>
    );
};

export default SignUpForm;