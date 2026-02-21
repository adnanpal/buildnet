import { useRef, useState } from "react";
import api from "../api/axios";

export function useSearch<T = any>(apiUrl: string,delay: number = 500) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");
  const debounceRef =  useRef<NodeJS.Timeout | null>(null);

  const search = async (value: string) => {
    if(debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async()=>{

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
  }, delay);
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
