// component/MapViewer.tsx
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mapImage from "../../public/map.gif";
import "../css/MapViewer.css";

const MapViewer = () => {
    return (
        <div className="map-wrapper">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                wheel={{ step: 0.1 }}
                doubleClick={{ disabled: true }}
                pinch={{ step: 5 }}
            >
                {({ zoomIn, zoomOut }) => (
                    <>
                        <div className="map-controls">
                            <button onClick={() => zoomIn()}>＋</button>
                            <button onClick={() => zoomOut()}>－</button>
                        </div>

                        <TransformComponent>
                            <img src={mapImage} alt="Map" className="map-image" />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default MapViewer;