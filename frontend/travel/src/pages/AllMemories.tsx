import { useEffect, useState } from "react";
import Header from "../component/Header";
import "../css/AllMemories.css";
import axiosClient from "../lib/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

interface MemoryResponse {
  id: number;
  title: string;
  prefecture: string;
  date: string;
  description: string;
  imageUrls: string[];
}

const AllMemories = () => {
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [prefecture, setPrefecture] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/auth/api/memories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(response.data);
    } catch (error) {
      console.error("思い出の取得に失敗しました:", error);
    }
  };

  // 初期状態で地図から来たときの都道府県をセット
  useEffect(() => {
    document.body.id = "all-memories";
    fetchMemories();

    const selectedPrefectureFromMap = location.state?.prefecture || "";
    setPrefecture(selectedPrefectureFromMap);
  }, [location.state]);

  return (
    <div className="all-memories-wrapper">
      <Header />
      <div className="all-memories-container">
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
        <div className="all-memory-list">
          {memories
            .filter((memory) => {
              if (prefecture === "") return true;
              return memory.prefecture === prefecture;
            })
            .map((memory) => (
              <div className="all-memory-card" key={memory.id}>
                <button
                  className="all-memory-button"
                  onClick={() => navigate(`/memories/${memory.id}`)}
                >
                  <h3>{memory.title}</h3>
                  <p>
                    {memory.prefecture} - {memory.date}
                  </p>
                  <p>{memory.description}</p>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllMemories;
