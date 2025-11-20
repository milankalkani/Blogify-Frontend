import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { io } from "socket.io-client";

const CommentContext = createContext();

// 🔌 Initialize socket connection
const socket = io(process.env.REACT_APP_API_URL, {
    transports: ["websocket"],
    reconnection: true,
});

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);

    // ✅ Fetch comments for a post
    const fetchComments = async (postId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/comments/${postId}`);
            setComments(res.data);
            setCurrentPostId(postId);

            // Join socket room for this post
            socket.emit("join_post", postId);
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Add a comment
    const addComment = async (postId, content, parentComment = null) => {
        try {
            const res = await axiosInstance.post("/comments", {
                postId,
                content,
                parentComment,
            });
            setComments((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    // ✅ Update a comment
    const updateComment = async (id, newContent) => {
        try {
            const res = await axiosInstance.put(`/comments/${id}`, {
                content: newContent,
            });
            setComments((prev) =>
                prev.map((c) => (c._id === id ? { ...c, content: newContent } : c))
            );
            return res.data;
        } catch (err) {
            console.error("Error updating comment:", err);
        }
    };

    // ✅ Delete a comment
    const deleteComment = async (id) => {
        try {
            await axiosInstance.delete(`/comments/${id}`);
            setComments((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    // ✅ Toggle like on a comment
    const toggleLike = async (id) => {
        try {
            const res = await axiosInstance.put(`/comments/${id}/like`);
            setComments((prev) =>
                prev.map((c) =>
                    c._id === id ? { ...c, likesCount: res.data.likes } : c
                )
            );
        } catch (err) {
            console.error("Error liking comment:", err);
        }
    };

    // 🧠 Socket listeners for real-time updates
    useEffect(() => {
        socket.on("new_comment", (comment) => {
            if (comment.post === currentPostId) {
                setComments((prev) => [comment, ...prev]);
            }
        });

        socket.on("delete_comment", (commentId) => {
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        });

        socket.on("update_comment", (data) => {
            setComments((prev) =>
                prev.map((c) => (c._id === data._id ? { ...c, content: data.content } : c))
            );
        });

        socket.on("update_likes", ({ commentId, likesCount }) => {
            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId ? { ...c, likesCount } : c
                )
            );
        });

        return () => {
            socket.off("new_comment");
            socket.off("delete_comment");
            socket.off("update_comment");
            socket.off("update_likes");
            if (currentPostId) socket.emit("leave_post", currentPostId);
        };
    }, [currentPostId]);

    return (
        <CommentContext.Provider
            value={{
                comments,
                loading,
                fetchComments,
                addComment,
                updateComment,
                deleteComment,
                toggleLike,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = () => useContext(CommentContext);
export default CommentContext;
