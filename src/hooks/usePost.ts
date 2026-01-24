import { useState } from "react";
import api from "../api/axios";

// src/types/createPost.ts
export interface CreatePostPayload {
  title: string;
  description: string;
  category: string;
  statuss: string;
  tags: string[];
  seeking: string[];
}

export function usePost() {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createPost = async (payload: any) => {
    try {
      setLoading(true);
      setError("");

      await api.post(
        "/api/posts",
        { data: payload },
      );

      return true;
    } catch (err) {
      setError("Failed to create post");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const updatePost = async (documentId: string, payload: any) => {
    try{
      setLoading(true);
      setError("");

      await api.put(
        `/api/posts/${documentId}`,
        {data:payload},
      );
      return true;
    } catch (err) {
      setError("Failed to update post");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { createPost, updatePost, loading, error };
}