import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemoryList from '../component/MemoryList';
import MemoryCreate from '../component/MemoryCreate';
import MapViewer from '../component/MapViewer';
import Header from '../component/Header';
import '../css/Main.css';


type Memory = {
    id: number;
    title: string;
    prefecture: string;
    date: string;
    description: string;
    imageUrls: string[];
};

const Main = () => {
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        document.body.id = 'main';
    }, []);


    const toggleCreateForm = () => {
        setShowCreate(!showCreate);

    };


    return (
        <div className="main-wrapper">
            <Header />
            <MemoryList />


            <div className="main-content">
                <div className="map-section">
                    <button onClick={toggleCreateForm} className="add-button">
                        {showCreate ? '一覧に戻る' : '＋ Memory'}
                    </button>

                </div>
                <MapViewer />

                {showCreate && (
                    <div className="create-form">
                        <MemoryCreate />
                    </div>
                )}
            </div>
        </div>
    );

};

export default Main;