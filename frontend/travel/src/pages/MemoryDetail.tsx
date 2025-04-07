import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../lib/axiosClient";
import Header from "../component/Header";
import MemoryList from "../component/MemoryList";
import MemoryEdit from "../component/MemoryEdit";
import "../css/MemoryDetail.css";

type MemoryImage = {
  id: number;
  imageUrl: string;
  comment: string | null;
};

type Memory = {
  id: number;
  title: string;
  prefecture: string;
  date: string;
  description: string;
  images: MemoryImage[];
};

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState<Memory | null>(null);
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);
  const [isMemoryEditing, setIsMemoryEditing] = useState(false);
  const [showCommentInputs, setShowCommentInputs] = useState<boolean[]>([]);
  const [commentInputs, setCommentInputs] = useState<string[]>([]);

  const fetchMemoryWithImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/auth/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.images) {
        console.warn("images が存在しません");
        setMemory(response.data);
        setImageBlobs([]);
        return;
      }

      setMemory(response.data);

      const blobs = await Promise.all(
        response.data.images.map(async (img: MemoryImage) => {
          const filename = img.imageUrl.split("/").pop();
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
      setShowCommentInputs(new Array(response.data.images.length).fill(false));
      setCommentInputs(
        response.data.images.map((img: MemoryImage) => img.comment || "")
      );
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

  const handleImageCommentSubmit = async (
    e: React.FormEvent,
    index: number
  ) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const imageId = memory?.images[index].id;
    const comment = commentInputs[index];

    try {
      await axiosClient.post(
        `/auth/api/memories/${id}/images/${imageId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowCommentInputs((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });

      fetchMemoryWithImages(); // 最新状態取得
    } catch (error) {
      console.error("コメントの保存に失敗:", error);
    }
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
      <MemoryList refreshKey={0} />
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
              {memory.images.map((img, index) => (
                <div className="photo-block" key={img.id}>
                  <div className="memory-comment">
                    {showCommentInputs[index] ? (
                      <div className="comment-form-container">
                        <form
                          onSubmit={(e) => handleImageCommentSubmit(e, index)}
                          className="comment-form"
                        >
                          <input
                            type="text"
                            value={commentInputs[index]}
                            onChange={(e) =>
                              setCommentInputs((prev) => {
                                const updated = [...prev];
                                updated[index] = e.target.value;
                                return updated;
                              })
                            }
                            autoFocus
                            placeholder="コメントを入力"
                          />
                          <button type="submit">保存</button>
                        </form>
                        <button
                          className="comment-cancel-button"
                          onClick={() => {
                            setShowCommentInputs((prev) => {
                              const updated = [...prev];
                              updated[index] = false;
                              return updated;
                            });
                          }}
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <div className="comment-display">
                        {img.comment ? (
                          <>
                            <p>{img.comment}</p>
                            <button
                              className="comment-edit-button"
                              onClick={() => {
                                setShowCommentInputs((prev) => {
                                  const updated = [...prev];
                                  updated[index] = true;
                                  return updated;
                                });
                              }}
                            >
                              編集
                            </button>
                          </>
                        ) : (
                          <button
                            className="comment-add-button"
                            onClick={() => {
                              setShowCommentInputs((prev) => {
                                const updated = [...prev];
                                updated[index] = true;
                                return updated;
                              });
                            }}
                          >
                            コメントを追加
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="image-and-button">
                    <img
                      src={imageBlobs[index]}
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
