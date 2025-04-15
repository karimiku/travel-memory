import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosClient from "../lib/axiosClient";
import { DetailedMemory } from "../types/Memory";

type MemoryContextType = {
  memories: DetailedMemory[];
  fetchMemories: () => Promise<void>;
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [memories, setMemories] = useState<DetailedMemory[]>([]);

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("/auth/api/memories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemories(response.data);
    } catch (error) {
      console.error("思い出の取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return (
    <MemoryContext.Provider value={{ memories, fetchMemories }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemoryContext = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemoryContext must be used within a MemoryProvider");
  }
  return context;
};
