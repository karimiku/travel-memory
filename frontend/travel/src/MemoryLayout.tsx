// MemoryLayout.tsx
import { MemoryProvider } from "./context/MemoryContext";
import { Outlet } from "react-router-dom";

const MemoryLayout = () => {
  return (
    <MemoryProvider>
      <Outlet />
    </MemoryProvider>
  );
};

export default MemoryLayout;
