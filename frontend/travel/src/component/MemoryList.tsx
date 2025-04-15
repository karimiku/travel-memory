import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BaseMemory } from "../types/Memory";
import "../css/MemoryList.css";

const CARD_WIDTH = 216;
const INTERVAL = 3000;

interface Props {
  memories: BaseMemory[];
}

const MemoryList = ({ memories }: Props) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollOneCard = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "right" ? CARD_WIDTH : -CARD_WIDTH;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || memories.length === 0) return;

    const scroll = () => {
      scrollOneCard("right");
      const maxScrollLeft = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScrollLeft) {
        el.scrollLeft = 0;
      }
    };

    const interval = setInterval(scroll, INTERVAL);
    return () => clearInterval(interval);
  }, [memories]);

  return (
    <div className="memory-carousel-wrapper">
      <button
        className="scroll-button left"
        onClick={() => scrollOneCard("left")}
      >
        {"<"}
      </button>
      <div className="memory-carousel" ref={scrollRef}>
        {memories.map((memory, index) => (
          <div key={`${memory.id}-${index}`} className="memory-card">
            <button
              className="memory-card-button"
              onClick={() => navigate(`/memories/${memory.id}`)}
            >
              <h3>{memory.title}</h3>
              <p>
                {memory.prefecture} ・ {memory.date}
              </p>
              <p className="description">{memory.description}</p>
            </button>
          </div>
        ))}
      </div>
      <button
        className="scroll-button right"
        onClick={() => scrollOneCard("right")}
      >
        {">"}
      </button>
    </div>
  );
};

export default MemoryList;
