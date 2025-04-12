import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import axiosClient from "../lib/axiosClient";
import Header from "../component/Header";
import MemoryList from "../component/MemoryList";
import MemoryEdit from "../component/MemoryEdit";
import "../css/MemoryDetail.css";
interface MemoryImage {
  id: number;
  imageUrl: string;
  comment: string | null;
}

interface Memory {
  id: number;
  title: string;
  prefecture: string;
  date: string;
  description: string;
  images: MemoryImage[];
}

const MemoryDetail = () => {
  useEffect(() => {
    document.body.id = "memory-detail";
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState<Memory | null>(null);
  const [imageBlobs, setImageBlobs] = useState<string[]>([]);
  const [isMemoryEditing, setIsMemoryEditing] = useState(false);
  const [commentInputs, setCommentInputs] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const { triggerToast, Toast } = useToast();

  const fetchMemoryWithImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`/auth/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMemory(response.data);

      const blobs = await Promise.all(
        response.data.images.map(async (img: MemoryImage) => {
          const filename = img.imageUrl.split("/").pop();
          try {
            const imageRes = await axiosClient.get(
              `/auth/api/memories/${id}/images/${filename}`,
              {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return URL.createObjectURL(imageRes.data);
          } catch (error) {
            console.error("画像の取得に失敗:", error);
            return null; // エラー時は null を返す
          }
        })
      );

      setImageBlobs(blobs.filter((blob) => blob !== null)); // null を除外
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
    triggerToast("思い出を更新しました！");
  };

  const handleCommentSave = async (index: number) => {
    const token = localStorage.getItem("token");
    const imageId = memory?.images[index].id;
    const comment = commentInputs[index];
    const beforeComment = memory?.images[index].comment ?? "";
    // コメントが変更されていなければ終了（編集モードだけ解除
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

      // 更新完了後に再取得
      await fetchMemoryWithImages();
      setEditingIndex(null);

      // 状態に応じてメッセージを切り替え
      if (beforeComment === "" && comment !== "") {
        triggerToast("コメントを追加しました！");
      } else if (beforeComment !== "" && comment === "") {
        triggerToast("コメントを削除しました！");
      } else if (beforeComment !== comment) {
        triggerToast("コメントを更新しました！");
      }
    } catch (error) {
      console.error("コメントの保存に失敗:", error);
      triggerToast("コメントの保存に失敗しました。");
      setEditingIndex(null); // 失敗時も解除しておくと安心
    }
  };

  const handleDeleteMemory = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosClient.delete(`/auth/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/main");
    } catch (error) {
      console.error("削除に失敗:", error);
      triggerToast("削除に失敗しました。");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axiosClient.delete(`/auth/api/memories/${id}/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMemoryWithImages();
      triggerToast("画像を削除しました！");
    } catch (error) {
      console.error("画像の削除に失敗:", error);
      triggerToast("画像の削除に失敗しました。");
    }
  };

  const adjustTextareaHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  if (!memory) return <p>読み込み中...</p>;

  return (
    <div className="main-wrapper">
      <Header />
      <MemoryList refreshKey={0} />
      <div className="memory-detail-container">
        {/* <Map refreshKey={0} /> */}
        <div className="memory-detail-body">
          <div className="memory-left">
            {isMemoryEditing ? (
              <MemoryEdit
                memory={memory}
                onCancel={() => setIsMemoryEditing(false)}
                onUpdated={handleUpdated}
                triggerToast={triggerToast}
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
                  <button onClick={handleDeleteMemory}>削除</button>
                </div>
              </>
            )}
          </div>

          <div className="memory-right">
            <div className="photo-wrapper">
              {memory.images.map((img, index) => (
                <div className="photo-block" key={img.id}>
                  <div className="comment-and-buttons">
                    <button
                      type="button"
                      className="memory-comment"
                      onClick={() => setEditingIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingIndex(index);
                        }
                      }}
                    >
                      {editingIndex === index ? (
                        <textarea
                          value={commentInputs[index]}
                          onChange={(e) => {
                            const updated = [...commentInputs];
                            updated[index] = e.target.value;
                            setCommentInputs(updated);
                            adjustTextareaHeight(
                              e.target as HTMLTextAreaElement
                            );
                          }}
                          onFocus={(e) => {
                            adjustTextareaHeight(
                              e.target as HTMLTextAreaElement
                            );
                          }}
                          onBlur={() => handleCommentSave(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleCommentSave(index);
                            }
                          }}
                          autoFocus
                          className="memory-inline-textarea"
                        />
                      ) : (
                        <p>{img.comment || "コメントを追加"}</p>
                      )}
                    </button>
                  </div>

                  <div className="image-container">
                    <img
                      src={imageBlobs[index]}
                      alt={`memory-${index}`}
                      className="memory-image"
                      onClick={() => setModalImage(imageBlobs[index])}
                    />
                    {modalImage && (
                      <div
                        className="modal-overlay"
                        onClick={() => setModalImage(null)}
                      >
                        <div
                          className="modal-content"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img src={modalImage} alt="拡大画像" />
                          <button
                            className="modal-close"
                            onClick={() => setModalImage(null)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      className="image-delete-button"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default MemoryDetail;
