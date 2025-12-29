import { useState } from "react";
import api from "../api/axios";

export function useSearch<T = any>(apiUrl: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");

  const search = async (value: string) => {
    if (!value.trim()) {
      setData(null);
      setError("");
      return;
    }

    try {
      const res = await api.get(`${apiUrl}${value}`);

      setData(res.data);
      setError("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setData(null);
        setError("Not found");
      } else {
        setError("Server error");
      }
    }
  };

  const reset = () => {
    setData(null);
    setError("");
  };

  return {
    data,
    error,
    search,
    reset,
  };
}
