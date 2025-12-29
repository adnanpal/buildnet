import { useState } from "react";

export function useSearch(apiUrl:string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const search = async (value:string) => {
    if (!value.trim()) {
      setData(null);
      setError("");
      return;
    }

    try {
      const res = await fetch(apiUrl + value);

      if (!res.ok) {
        setData(null);
        setError("Not found");
        return;
      }

      const json = await res.json();
      setData(json);
      setError("");
    } catch {
      setError("Server error");
    }
  };

  const reset = () => {
    setData(null);
    setError("");
  };

  return { data, error, search, reset };
}
