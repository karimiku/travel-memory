import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import axiosClient from "../lib/axiosClient";

export interface Memory {
  id: number;
  title: string;
  prefecture: string;
  date: string;
  description: string;
  imageUrls: string[];
}

interface MemoryContextType {
  memories: Memory[];
  visitedPrefectures: string[];
  fetchMemories: () => Promise<void>;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const useMemoryContext = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemoryContext must be used within MemoryProvider");
  }
  return context;
};

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get<Memory[]>("/auth/api/memories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(res.data);
    } catch (err) {
      console.error("思い出の取得に失敗:", err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // ✅ useMemo を使って visitedPrefectures を計算
  const visitedPrefectures = useMemo(() => {
    return Array.from(new Set(memories.map((memory) => memory.prefecture)));
  }, [memories]);

  return (
    <MemoryContext.Provider
      value={{ memories, visitedPrefectures, fetchMemories }}
    >
      {children}
    </MemoryContext.Provider>
  );
};
