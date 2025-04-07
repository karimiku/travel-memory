import React from "react";
import { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import japanData from "../data/japan.json";
import "../css/Map.css";
import prefectureMap from "../data/prefectureMap";
import axiosClient from "../lib/axiosClient";

interface MemoryPrefectureResponse {
  prefecture: string;
}

const Map = () => {
  const [prefectures, setPrefectures] = useState<MemoryPrefectureResponse[]>(
    []
  );

  const visitedPrefectures = useMemo(() => {
    return prefectures
      .map((p) => prefectureMap[p.prefecture])
      .filter((name): name is string => !!name);
  }, [prefectures]);

  const getPrefectureColor = (name: string) => {
    return visitedPrefectures.includes(name) ? "#F2DEC4" : "#808080";
  };

  const fetchPrefectures = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/auth/api/memories/prefectures", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrefectures(response.data);
    } catch (error) {
      console.error("思い出の取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);

  return (
    <div className="map-frame">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 3100, center: [137.0, 38.0] }}
        width={1200}
        height={1400}
      >
        <Geographies geography={japanData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getPrefectureColor(geo.properties.name)}
                stroke="#FFF"
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#2196f3", outline: "none" },
                  pressed: { fill: "#1976d2", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
