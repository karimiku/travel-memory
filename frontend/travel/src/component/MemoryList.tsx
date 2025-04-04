import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MemoryList.css';
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
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const CARD_WIDTH = 216; // 200px 幅 + 16px gap
    const INTERVAL = 3000; // 2秒ごと

    const scrollOneCard = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;

        const amount = direction === 'right' ? CARD_WIDTH : -CARD_WIDTH;
        el.scrollBy({ left: amount, behavior: 'smooth' });
    };

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

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || memories.length === 0) return;

        const scroll = () => {
            scrollOneCard('right');

            // 無限ループ補正
            const maxScrollLeft = el.scrollWidth / 2;
            if (el.scrollLeft >= maxScrollLeft) {
                el.scrollLeft = 0;
            }
        };

        const interval = setInterval(scroll, INTERVAL);
        return () => clearInterval(interval);
    }, [memories]);

    return (
        <div className="memory-carousel-wrapper">
            <button className="scroll-button left" onClick={() => scrollOneCard('left')}>
                {'<'}
            </button>

            <div className="memory-carousel" ref={scrollRef}>
                {[...memories, ...memories].map((memory, index) => (
                    <div key={`${memory.id}-${index}`} className="memory-card">
                        <button
                            className="memory-card-button"
                            onClick={() => navigate(`/memories/${memory.id}`)}
                        >
                            <h3>{memory.title}</h3>
                            <p>{memory.prefecture} ・ {memory.date}</p>
                            <p className="description">{memory.description}</p>
                        </button>
                    </div>
                ))}
            </div>

            <button className="scroll-button right" onClick={() => scrollOneCard('right')}>
                {'>'}
            </button>
        </div>
    );
};

export default MemoryList;