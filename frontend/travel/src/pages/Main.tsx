import { useEffect, useState } from "react";
import MemoryList from "../component/MemoryList";
import MemoryCreate from "../component/MemoryCreate";
import Map from "../component/Map";
import Header from "../component/Header";
import "../css/Main.css";

const Main = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    document.body.id = "main";
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <MemoryList refreshKey={refreshKey} />
      <div className="main-content">
        <div className="map-selection">
          <Map refreshKey={refreshKey} />
        </div>
        <div className="create-form">
          <MemoryCreate onMemoryCreated={triggerRefresh} />
        </div>
      </div>
    </div>
  );
};

export default Main;
