import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from '../component/GoogleLoginButton';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', {
                email,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);
            console.log('ログイン成功', token);

            navigate('/home');
        } catch (error: any) {
            console.error('ログイン失敗', error);
            setErrorMsg('ログインに失敗しました。');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ユーザー名：</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>パスワード：</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

                <button type="submit">ログイン</button>
            </form>
            <GoogleLoginButton />

            <Link to="/signup">新規登録</Link>
        </>
    );
};

export default LoginForm;