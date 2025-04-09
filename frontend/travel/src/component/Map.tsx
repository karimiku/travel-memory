import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import japanData from "../data/japan.json";
import "../css/Map.css";
import japaneseToEnglishMap from "../data/japaneseToEnglishMap";
import englishToJapaneseMap from "../data/englishToJapaneseMap";
import axiosClient from "../lib/axiosClient";

interface MemoryPrefectureResponse {
  prefecture: string;
}

type Props = {
  refreshKey: number;
};

const Map = ({ refreshKey }: Props) => {
  const navigate = useNavigate();
  const [prefectures, setPrefectures] = useState<MemoryPrefectureResponse[]>(
    []
  );

  const visitedPrefectures = useMemo(() => {
    return prefectures
      .map((p) => japaneseToEnglishMap[p.prefecture])
      .filter((name): name is string => !!name);
  }, [prefectures]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosClient.get(
          "/auth/api/memories/prefectures",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrefectures(response.data);
      } catch (error) {
        console.error("思い出の取得に失敗しました:", error);
      }
    };
    fetchPrefectures();
  }, [refreshKey]);

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
            geographies.map((geo) => {
              const isVisited = visitedPrefectures.includes(
                geo.properties.name
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={
                    isVisited
                      ? () =>
                          navigate(`/allMemories`, {
                            state: {
                              prefecture:
                                englishToJapaneseMap[geo.properties.name],
                            },
                          })
                      : undefined
                  }
                  stroke="#FFF"
                  style={
                    {
                      default: {
                        fill: isVisited ? "#f5e0c8" : "#d3d3d3",
                        cursor: isVisited ? "pointer" : "default",
                        transition: "fill 0.3s ease",
                        outline: "none",
                      },
                      hover: {
                        fill: isVisited ? "#eebd7d" : "#d3d3d3",
                        outline: "none",
                      },
                      pressed: {
                        fill: isVisited ? "#e6733f" : "#d3d3d3",
                        outline: "none",
                      },
                    } as any
                  }
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
