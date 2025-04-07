import { useState } from "react";
import axiosClient from "../lib/axiosClient";
import "../css/MemoryCreate.css";

type Props = {
  onMemoryCreated: () => void;
};

const MemoryCreate = ({ onMemoryCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("prefecture", prefecture);
    formData.append("date", date);
    formData.append("description", description);
    files.forEach((file) => formData.append("images", file));

    try {
      await axiosClient.post("/auth/api/memories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // リスト更新通知
      onMemoryCreated();

      // フォーム初期化
      setTitle("");
      setPrefecture("");
      setDate("");
      setDescription("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("登録に失敗しました");
    }
  };

  return (
    <>
      <form className="memory-form" onSubmit={handleSubmit}>
        <h1>Memory</h1>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          required
        >
          <option value="">都道府県</option>
          <option value="北海道">北海道</option>
          <option value="青森県">青森県</option>
          <option value="岩手県">岩手県</option>
          <option value="宮城県">宮城県</option>
          <option value="秋田県">秋田県</option>
          <option value="山形県">山形県</option>
          <option value="福島県">福島県</option>
          <option value="茨城県">茨城県</option>
          <option value="栃木県">栃木県</option>
          <option value="群馬県">群馬県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="千葉県">千葉県</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
          {/* ...他も同様に... */}
        </select>
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
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files));
            }
          }}
        />
        <button type="submit">登録する</button>
      </form>
      <div className={`toast ${showToast ? "show" : ""}`}>
        思い出が登録されました！
      </div>
    </>
  );
};

export default MemoryCreate;
