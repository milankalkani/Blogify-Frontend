import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Get logged-in user's ID safely
    const getMyId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.id || user?._id || null;
        } catch {
            return null;
        }
    };

    // ✅ Fetch all posts
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/posts");
            setPosts(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Fetch current user's posts
    const fetchMyPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/posts/mine");
            setPosts(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch your posts");
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Fetch single post (prevents repeated refetch)
    const fetchPostById = useCallback(
        async (id) => {
            // avoid unnecessary API call
            if (currentPost && currentPost._id === id) return currentPost;

            setLoading(true);
            try {
                const res = await axiosInstance.get(`/posts/${id}`);
                setCurrentPost(res.data);
                setError(null);
                return res.data;
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch post");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [currentPost]
    );

    // ✅ Create post
    const createPost = async (newPost) => {
        try {
            const res = await axiosInstance.post("/posts", newPost);
            setPosts((prev) => [res.data.post, ...prev]);
            return res.data.post;
        } catch (err) {
            console.error("Error creating post:", err);
            throw err;
        }
    };

    // ✅ Update post
    const updatePost = async (id, data) => {
        try {
            const res = await axiosInstance.put(`/posts/${id}`, data);
            setPosts((prev) =>
                prev.map((p) => (p._id === id ? res.data.post : p))
            );
            if (currentPost && currentPost._id === id)
                setCurrentPost(res.data.post);
            return res.data.post;
        } catch (err) {
            console.error("Error updating post:", err);
            throw err;
        }
    };

    // ✅ Delete post
    const deletePost = async (id) => {
        try {
            await axiosInstance.delete(`/posts/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
            if (currentPost && currentPost._id === id) setCurrentPost(null);
        } catch (err) {
            console.error("Error deleting post:", err);
            throw err;
        }
    };

    // ✅ Like post (instant UI update)
    const likePost = async (id) => {
        try {
            const res = await axiosInstance.put(`/posts/${id}/like`);
            const myId = getMyId();

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === id
                        ? { ...p, likes: [...(p.likes || []), myId] }
                        : p
                )
            );

            if (currentPost && currentPost._id === id) {
                setCurrentPost((prev) => ({
                    ...prev,
                    likes: [...(prev.likes || []), myId],
                }));
            }

            return res.data;
        } catch (err) {
            console.error("Like error:", err);
            throw err;
        }
    };

    // ✅ Unlike post (instant UI update)
    const unlikePost = async (id) => {
        try {
            const res = await axiosInstance.put(`/posts/${id}/unlike`);
            const myId = getMyId();

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === id
                        ? {
                            ...p,
                            likes: (p.likes || []).filter((u) => u !== myId),
                        }
                        : p
                )
            );

            if (currentPost && currentPost._id === id) {
                setCurrentPost((prev) => ({
                    ...prev,
                    likes: (prev.likes || []).filter((u) => u !== myId),
                }));
            }

            return res.data;
        } catch (err) {
            console.error("Unlike error:", err);
            throw err;
        }
    };

    // ✅ Load all posts once
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <PostContext.Provider
            value={{
                posts,
                currentPost,
                setCurrentPost,
                loading,
                error,
                fetchPosts,
                fetchMyPosts,
                fetchPostById,
                createPost,
                updatePost,
                deletePost,
                likePost,
                unlikePost,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => useContext(PostContext);
export default PostContext;
