// components/MemoryEdit.tsx
import { useEffect, useState } from 'react';
import axiosClient from '../lib/axiosClient';
import '../css/MemoryEdit.css';

type Memory = {
    id: number;
    title: string;
    prefecture: string;
    date: string;
    description: string;
    imageUrls: string[];
};

type Props = {
    memory: Memory;
    onCancel: () => void;
    onUpdated: () => void;
};

const MemoryEdit = ({ memory, onCancel, onUpdated }: Props) => {
    const [title, setTitle] = useState(memory.title);
    const [prefecture, setPrefecture] = useState(memory.prefecture);
    const [date, setDate] = useState(memory.date);
    const [description, setDescription] = useState(memory.description);

    useEffect(() => {
        setTitle(memory.title);
        setPrefecture(memory.prefecture);
        setDate(memory.date);
        setDescription(memory.description);
    }
    )

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosClient.put(`/api/memories/${memory.id}`, {
                title,
                prefecture,
                date,
                description,
                imageUrls: memory.imageUrls
            });

            alert('思い出を更新しました！');
            onUpdated();
        } catch (error) {
            console.error('更新に失敗しました:', error);
            alert('更新に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleUpdate} className="memory-edit-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトル"
                required
            />

            <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)} required>
                <option value="">都道府県を選択</option>
                {[
                    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
                    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
                    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
                    "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
                    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
                    "徳島県", "香川県", "愛媛県", "高知県",
                    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
                ].map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                ))}
            </select>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="説明"
                rows={5}
            />

            <div className="form-edit-buttons">
                <button type="submit">更新する</button>
                <button type="button" onClick={onCancel}>キャンセル</button>
            </div>
        </form>
    );
};

export default MemoryEdit;