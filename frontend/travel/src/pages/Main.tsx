import { useState } from 'react';
import MemoryList from '../component/MemoryList';
import MemoryCreate from '../component/MemoryCreate';
import '../css/Main.css';

const Main = () => {
    const [showCreate, setShowCreate] = useState(false);

    const toggleCreateForm: () => void = () => {
        setShowCreate(!showCreate);
    };

    return (
        <div className="main-container">
            <div className="left-section">
                {/* 地図やその他のUI要素 */}
                <h2>訪問エリア地図など</h2>
                <button onClick={toggleCreateForm} className="create-button">
                    {showCreate ? '一覧に戻る' : '思い出を追加'}
                </button>
            </div>

            <div className="right-section">
                {showCreate ? <MemoryCreate /> : <MemoryList />}
            </div>
        </div>
    );
};

export default Main;