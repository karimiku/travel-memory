import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../lib/axiosClient';
import Header from '../component/Header';
import MemoryList from '../component/MemoryList';
import MemoryEdit from '../component/MemoryEdit';
import mapImage from '../../public/map.gif';
import '../css/MemoryDetail.css';


type Memory = {
    id: number;
    title: string;
    prefecture: string;
    date: string;
    description: string;
    imageUrls: string[];
};

const MemoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [memory, setMemory] = useState<Memory | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosClient.get(`/api/memories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMemory(response.data);
            } catch (error) {
                console.error('詳細の取得に失敗:', error);
            }
        };
        fetchMemory();
    }, [id]);

    const handleEditToggle = () => setIsEditing(true);

    const handleUpdated = () => {
        setIsEditing(false);
        // 最新情報を再取得
        const fetchMemory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosClient.get(`/api/memories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMemory(response.data);
            } catch (error) {
                console.error('更新後の取得に失敗:', error);
            }
        };
        fetchMemory();
    };

    const handleDelete = async () => {
        if (!window.confirm('本当に削除しますか？')) return;

        try {
            const token = localStorage.getItem('token');
            await axiosClient.delete(`/api/memories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/main');
        } catch (error) {
            console.error('削除に失敗:', error);
        }
    };

    if (!memory) return <p>読み込み中...</p>;

    return (
        <div className="main-wrapper">
            <Header />
            <MemoryList />
            <div className="memory-detail-container">
                <div className="memory-detail-body">
                    {/* 左カラム */}
                    <div className="memory-left">
                        {isEditing ? (
                            <MemoryEdit
                                memory={memory}
                                onCancel={() => setIsEditing(false)}
                                onUpdated={handleUpdated}
                            />
                        ) : (
                            <>
                                <h2>{memory.title}</h2>
                                <p>{memory.prefecture}・{memory.date}</p>
                                <p className="memory-detail-description">{memory.description}</p>
                                <div className="memory-buttons">
                                    <button onClick={handleEditToggle}>編集</button>
                                    <button onClick={handleDelete}>削除</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 右カラム */}
                    <div className="memory-right">
                        <div className="memory-comment">
                            写真に対するコメント（今後追加予定）
                        </div>
                        <div className="photo-wrapper">
                            {memory.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url || mapImage}
                                    alt={`memory-${index}`}
                                    className="memory-image"
                                />
                            ))}
                            <button className="comment-add-button">コメント追加</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryDetail;