import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../lib/axiosClient";
import Header from "../component/Header";
import MemoryList from "../component/MemoryList";
import MemoryEdit from "../component/MemoryEdit";
import "../css/MemoryDetail.css";

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
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);
  const [isMemoryEditing, setIsMemoryEditing] = useState(false);

  const fetchMemoryWithImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/auth/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemory(response.data);

      const blobs = await Promise.all(
        response.data.imageUrls.map(async (url: string) => {
          const filename = url.split("/").pop();
          const imageRes = await axiosClient.get(
            `/auth/api/memories/${id}/images/${filename}`,
            {
              responseType: "blob",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return URL.createObjectURL(imageRes.data);
        })
      );
      setImageBlobs(blobs);
    } catch (error) {
      console.error("データの取得に失敗:", error);
    }
  };

  useEffect(() => {
    fetchMemoryWithImages();
  }, [id]);

  const handleEditToggle = () => setIsMemoryEditing(true);

  const handleUpdated = () => {
    setIsMemoryEditing(false);
    fetchMemoryWithImages();
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosClient.delete(`/auth/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/main");
    } catch (error) {
      console.error("削除に失敗:", error);
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
            {isMemoryEditing ? (
              <MemoryEdit
                memory={memory}
                onCancel={() => setIsMemoryEditing(false)}
                onUpdated={handleUpdated}
              />
            ) : (
              <>
                <h2>{memory.title}</h2>
                <p>
                  {memory.prefecture}・{memory.date}
                </p>
                <p className="memory-detail-description">
                  {memory.description}
                </p>
                <div className="memory-buttons">
                  <button onClick={handleEditToggle}>編集</button>
                  <button onClick={handleDelete}>削除</button>
                </div>
              </>
            )}
          </div>

          {/* 右カラム */}
          <div className="memory-right">
            <div className="photo-wrapper">
              {imageBlobs.map((blobUrl, index) => (
                <div className="photo-block" key={index}>
                  <div className="memory-comment">
                    写真に対するコメント（今後追加予定）
                  </div>
                  <div className="image-and-button">
                    <button className="comment-add-button">コメント追加</button>
                    <img
                      src={blobUrl}
                      alt={`memory-${index}`}
                      className="memory-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetail;
