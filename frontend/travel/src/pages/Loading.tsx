import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Loading.css';

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home')
        }, 2000);
        return () => clearTimeout(timer);

    }, [navigate]);

    return (
        <div className="wrapper">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <span>Loading</span>
        </div>


    )

}

export default Loading;