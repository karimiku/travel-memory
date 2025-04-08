// src/hooks/useToast.ts
import { useState, useRef } from "react";
import "../css/Toast.css";

export const useToast = () => {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const triggerToast = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);

    //既存のタイマーがあればキャンセルする
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      timeoutRef.current = null;
    }, 3000);
  };

  const Toast = () => {
    return isVisible ? (
      <div className={`toast ${isVisible ? "show" : ""}`}>{message}</div>
    ) : null;
  };

  return { triggerToast, Toast };
};
