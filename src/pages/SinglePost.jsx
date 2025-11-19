import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePosts } from "../context/PostContext";
import { useComments } from "../context/CommentContext";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const commentSchema = Yup.object().shape({
  content: Yup.string().trim().min(1, "Comment cannot be empty").required(),
});

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPostById, currentPost, loading, deletePost, likePost, unlikePost } =
    usePosts();
  const { user } = useAuth();
  const { comments, fetchComments, addComment, deleteComment } = useComments();

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);

  const commentSectionRef = useRef(null);

  useEffect(() => {
    fetchPostById(id);
    fetchComments(id);
    // eslint-disable-next-line
  }, [id]);

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isAuthor = () => {
    if (!currentPost || !user) return false;
    const authorId = currentPost.author?._id || currentPost.author;
    const myId = user.id || user._id;
    return authorId?.toString() === myId?.toString();
  };

  const hasLiked = () => {
    const myId = user?.id || user?._id;
    return currentPost?.likes?.some((u) => u.toString() === myId?.toString());
  };

  const handleLikeToggle = async () => {
    if (!user) return navigate("/login");
    setLocalLoading(true);
    try {
      hasLiked() ? await unlikePost(id) : await likePost(id);
      await fetchPostById(id);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    setLocalLoading(true);
    try {
      await deletePost(id);
      navigate("/");
    } catch {
      setError("Failed to delete post");
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading || !currentPost)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );

  const post = currentPost;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ===========================
           HERO IMAGE
      ============================ */}
      <div className="w-full relative">
        <img
          src={post.image?.url}
          className="w-full h-[60vh] object-cover"
          alt={post.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="mt-6 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg text-white text-sm font-medium backdrop-blur-md ${
                hasLiked()
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              ❤️ {hasLiked() ? "Liked" : "Like"} ({post.likes?.length})
            </button>

            <button
              onClick={scrollToComments}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium backdrop-blur-md"
            >
              💬 Comment
            </button>

            {isAuthor() && (
              <>
                <Link
                  to={`/edit/${post._id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg text-sm font-medium"
                >
                  ✏ Edit
                </Link>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg text-sm font-medium"
                >
                  🗑 Delete
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* ===========================
           TWO-COLUMN SECTION
      ============================ */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: MAIN CONTENT */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="text-gray-500 text-sm mb-6">
              By{" "}
              <span className="font-semibold text-gray-700">
                {post.author?.name}
              </span>{" "}
              • {new Date(post.createdAt).toLocaleString()}
            </div>

            <article className="prose md:prose-lg prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>

        {/* RIGHT: COMMENTS */}
        <div
          ref={commentSectionRef}
          className="sticky top-28 h-fit bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          {/* --- Add Comment --- */}
          {user ? (
            <Formik
              initialValues={{ content: "" }}
              validationSchema={commentSchema}
              onSubmit={async (values, { resetForm }) => {
                await addComment(id, values.content);
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex gap-3 mb-5">
                  <Field
                    name="content"
                    as="input"
                    placeholder="Write a comment..."
                    className="flex-1 border rounded-xl px-4 py-2 border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700"
                  >
                    Post
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <p className="text-gray-500 mb-4">
              <Link to="/login" className="text-blue-600 font-medium">
                Log in
              </Link>{" "}
              to comment.
            </p>
          )}

          {/* --- Comment List --- */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-700">
                      {comment.author?.name}
                    </p>

                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="text-red-500 text-xs"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-gray-800 mt-2">{comment.content}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default SinglePost;
