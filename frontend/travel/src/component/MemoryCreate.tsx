import { useState } from 'react';
import axios from 'axios';
import axiosClient from '../lib/axiosClient';

const MemoryCreate = () => {
    const [title, setTitle] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState(['']);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axiosClient.post(
                '/api/memories',
                { title, prefecture, date, description, imageUrls },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('思い出を登録しました！');
            setTitle('');
            setPrefecture('');
            setDate('');
            setDescription('');
            setImageUrls(['']);
        } catch (err) {
            console.error(err);
            alert('登録に失敗しました');
        }
    };

    return (
        <form className="memory-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="都道府県"
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <textarea
                placeholder="詳細"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="画像URL (カンマ区切り可)"
                value={imageUrls.join(',')}
                onChange={(e) => setImageUrls(e.target.value.split(','))}
            />
            <button type="submit">登録する</button>
        </form>
    );
};

export default MemoryCreate;
