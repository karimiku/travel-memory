import { lazy, Suspense, useEffect, useRef } from "react";
import Header from "../component/Header";
import MemoryCreate from "../component/MemoryCreate";
import "../css/Main.css";
import { useMemoryContext } from "../context/MemoryContext";
import { useToast } from "../hooks/useToast";
import { useLocation, useNavigate } from "react-router-dom";
// 遅延読み込み
const MemoryList = lazy(() => import("../component/MemoryList"));
const Map = lazy(() => import("../component/Map"));

const Main = () => {
  useEffect(() => {
    document.body.id = "main";
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { memories, fetchMemories } = useMemoryContext();
  const { triggerToast, Toast } = useToast();

  const hasTriggeredRef = useRef(false); // ← 1回だけ表示するためのフラグ

  useEffect(() => {
    if (location.state?.toast && !hasTriggeredRef.current) {
      console.log("🎉 Toast message:", location.state.toast);
      triggerToast(location.state.toast);

      // ✅ 1回しか表示させない
      hasTriggeredRef.current = true;

      navigate(".", { replace: true, state: {} });
    }
  }, [location.state?.toast, triggerToast]);

  return (
    <div className="main-wrapper">
      <Header />

      <Suspense
        fallback={<div className="placeholder">思い出を読み込み中...</div>}
      >
        <MemoryList memories={memories} />
      </Suspense>

      <div className="main-content">
        <div className="map-selection">
          <Suspense
            fallback={<div className="placeholder">地図を読み込み中...</div>}
          >
            <Map
              visitedPrefectures={memories.map((memory) => memory.prefecture)}
            />
          </Suspense>
        </div>
        <div className="create-form">
          <MemoryCreate onCreated={fetchMemories} />
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default Main;
