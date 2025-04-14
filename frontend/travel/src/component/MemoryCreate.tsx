import React, { useState } from "react";
import { useToast } from "../hooks/useToast";
import { useMemoryContext } from "../context/MemoryContext";
import axiosClient from "../lib/axiosClient";
import "../css/MemoryCreate.css";
import "../css/Toast.css";

const MemoryCreate = () => {
  const [title, setTitle] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const { triggerToast, Toast } = useToast();
  const { fetchMemories } = useMemoryContext();

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

      triggerToast("思い出が登録されました！");
      fetchMemories(); // ⬅️ ここで即時反映！

      // フォーム初期化
      setTitle("");
      setPrefecture("");
      setDate("");
      setDescription("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      triggerToast("登録に失敗しました");
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
        {/* 以下略（select, textarea, inputなどは変更なし） */}
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          required
        >
          <option value="">都道府県を選択</option>
          {[
            "北海道",
            "青森県",
            "岩手県",
            "宮城県",
            "秋田県",
            "山形県",
            "福島県",
            "茨城県",
            "栃木県",
            "群馬県",
            "埼玉県",
            "千葉県",
            "東京都",
            "神奈川県",
            "新潟県",
            "富山県",
            "石川県",
            "福井県",
            "山梨県",
            "長野県",
            "岐阜県",
            "静岡県",
            "愛知県",
            "三重県",
            "滋賀県",
            "京都府",
            "大阪府",
            "兵庫県",
            "奈良県",
            "和歌山県",
            "鳥取県",
            "島根県",
            "岡山県",
            "広島県",
            "山口県",
            "徳島県",
            "香川県",
            "愛媛県",
            "高知県",
            "福岡県",
            "佐賀県",
            "長崎県",
            "熊本県",
            "大分県",
            "宮崎県",
            "鹿児島県",
            "沖縄県",
          ].map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
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
      <Toast />
    </>
  );
};

export default React.memo(MemoryCreate);
