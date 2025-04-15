import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import japanData from "../data/japan.json";
import "../css/Map.css";
import japaneseToEnglishMap from "../data/japaneseToEnglishMap";
import englishToJapaneseMap from "../data/englishToJapaneseMap";

type Props = {
  visitedPrefectures: string[];
};
const Map = ({ visitedPrefectures }: Props) => {
  const navigate = useNavigate();

  // 日本語都道府県名 → 英語名への変換
  const visited = useMemo(() => {
    const result = visitedPrefectures
      .map((jp) => japaneseToEnglishMap[jp])
      .filter((name): name is string => !!name);
    return result;
  }, [visitedPrefectures]);

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
              const isVisited = visited.includes(geo.properties.name);
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

export default React.memo(Map);
