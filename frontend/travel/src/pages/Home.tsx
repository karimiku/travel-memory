import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token'); // トークン削除
        navigate('/'); // ログインページへ遷移
    };

    return (
        <div>
            helloworld
            <button onClick={handleLogout}>ログアウト</button>

        </div>
    )
}

export default Home;