import { lazy, Suspense, useEffect } from "react";
import Header from "../component/Header";
import MemoryCreate from "../component/MemoryCreate";
import "../css/Main.css";
import { useMemoryContext } from "../context/MemoryContext";
const MemoryList = lazy(() => import("../component/MemoryList"));
const Map = lazy(() => import("../component/Map"));

const Main = () => {
  console.log("🗾 Main");
  useEffect(() => {
    document.body.id = "main";
  }, []);
  return (
    <div className="main-wrapper">
      <Header />

      <Suspense
        fallback={<div className="placeholder">思い出を読み込み中...</div>}
      >
        <MemoryList />
      </Suspense>

      <div className="main-content">
        <div className="map-selection">
          <Suspense
            fallback={<div className="placeholder">地図を読み込み中...</div>}
          >
            <Map />
          </Suspense>
        </div>
        <div className="create-form">
          <MemoryCreate />
        </div>
      </div>
    </div>
  );
};

export default Main;
