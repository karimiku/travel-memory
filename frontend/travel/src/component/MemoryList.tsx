// components/MemoryList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '../lib/axiosClient';

type Memory = {
    id: number;
    title: string;
    prefecture: string;
    date: string;
    description: string;
    imageUrls: string[];
};

const MemoryList = () => {
    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosClient.get('/api/memories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMemories(response.data);
            } catch (error) {
                console.error('思い出の取得に失敗しました:', error);
            }
        };

        fetchMemories();
    }, []);

    return (
        <div className="memory-list-container">
            <h2 className="memory-title">思い出一覧</h2>
            {memories.length === 0 ? (
                <p>まだ思い出がありません。</p>
            ) : (
                <ul className="memory-list">
                    {memories.map((memory) => (
                        <li key={memory.id} className="memory-item">
                            <h3>{memory.title}</h3>
                            <p>{memory.prefecture} - {memory.date}</p>
                            <p>{memory.description}</p>
                            <div className="image-preview">
                                {memory.imageUrls.map((url, index) => (
                                    url && <img key={index} src={url} alt={`memory-${index}`} />
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MemoryList;