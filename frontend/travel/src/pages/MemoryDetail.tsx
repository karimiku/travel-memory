import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import axiosClient from "../lib/axiosClient";
import Header from "../component/Header";
import MemoryList from "../component/MemoryList";
import MemoryEdit from "../component/MemoryEdit";
import "../css/MemoryDetail.css";
import { useMemoryContext } from "../context/MemoryContext";

const MemoryDetail = () => {
  useEffect(() => {
    document.body.id = "memory-detail";
  }, []);
  const { id } = useParams();
  const { memories, fetchMemories } = useMemoryContext();
  const { triggerToast, Toast } = useToast();

  const navigate = useNavigate();

  // ✅ memory取得はnull fallbackに変更
  const memory = memories.find((m) => m.id.toString() === id) || null;

  const [imageBlobs, setImageBlobs] = useState<string[]>([]);
  const [isMemoryEditing, setIsMemoryEditing] = useState(false);
  const [commentInputs, setCommentInputs] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const fetchMemoryOnlyImages = async () => {
    if (!memory || !memory.images) return;

    try {
      const blobs = await Promise.all(
        memory.images.map(async (img) => {
          const filename = img.imageUrl?.split("/").pop();
          if (!filename) return null;

          try {
            const imageRes = await axiosClient.get(
              `/auth/api/memories/${memory.id}/images/${filename}`,
              {
                responseType: "blob",
              }
            );
            return URL.createObjectURL(imageRes.data);
          } catch (error) {
            console.error("画像の取得に失敗:", error);
            return null;
          }
        })
      );

      setImageBlobs(blobs.filter((blob): blob is string => blob !== null));
      setCommentInputs(memory.images.map((img) => img.comment || ""));
    } catch (error) {
      console.error("画像取得中にエラー:", error);
    }
  };

  useEffect(() => {
    fetchMemoryOnlyImages();
  }, [id, memory]);

  const handleEditToggle = () => setIsMemoryEditing(true);

  const handleUpdated = async () => {
    setIsMemoryEditing(false);
    await fetchMemories();
    triggerToast("思い出を更新しました！");
  };

  const handleCommentSave = async (index: number) => {
    const imageId = memory?.images[index].id;
    const comment = commentInputs[index];
    const beforeComment = memory?.images[index].comment ?? "";

    try {
      await axiosClient.post(
        `/auth/api/memories/${id}/images/${imageId}/comment`,
        { comment }
      );
      await fetchMemories();
      setEditingIndex(null);

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
      setEditingIndex(null);
    }
  };

  const handleDeleteMemory = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await axiosClient.delete(`/auth/api/memories/${id}`);
      await fetchMemories();
      navigate("/main", {
        state: { toast: "思い出を削除しました！" },
      });
    } catch (error) {
      console.error("削除に失敗:", error);
      triggerToast("削除に失敗しました。");
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await axiosClient.delete(`/auth/api/memories/${id}/images/${imageId}`);
      fetchMemories();
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
      <MemoryList memories={memories} />
      <div className="memory-detail-container">
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
                    >
                      {editingIndex === index ? (
                        <textarea
                          value={commentInputs[index]}
                          onChange={(e) => {
                            const updated = [...commentInputs];
                            updated[index] = e.target.value;
                            setCommentInputs(updated);
                            adjustTextareaHeight(e.target);
                          }}
                          onFocus={(e) => adjustTextareaHeight(e.target)}
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
