import React, { useEffect, useState } from "react";
import { useComments } from "../context/CommentContext";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CommentSection = ({ postId }) => {
    const { user } = useAuth();
    const {
        comments,
        loading,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        toggleLike,
    } = useComments();

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchComments(postId);
    }, [postId]);

    const validationSchema = Yup.object({
        content: Yup.string()
            .min(2, "Comment too short")
            .required("Comment is required"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        await addComment(postId, values.content);
        resetForm();
    };

    const handleEdit = async (id, content) => {
        await updateComment(id, content);
        setEditingId(null);
    };

    if (loading)
        return (
            <div className="mt-4 text-gray-500 text-center">Loading comments...</div>
        );

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments 💬</h3>

            {user ? (
                <Formik
                    initialValues={{ content: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="mb-6">
                            <div className="flex flex-col sm:flex-row items-start gap-2">
                                <Field
                                    name="content"
                                    as="textarea"
                                    rows="2"
                                    placeholder="Add a comment..."
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-forest/40"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-forest text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                                    style={{ backgroundColor: "#5D866C" }}
                                >
                                    {isSubmitting ? "Posting..." : "Post"}
                                </button>
                            </div>
                            <ErrorMessage
                                name="content"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </Form>
                    )}
                </Formik>
            ) : (
                <p className="text-gray-600">
                    <i>Login to add comments.</i>
                </p>
            )}

            {/* List comments */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center">No comments yet.</p>
                ) : (
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="border border-gray-200 rounded-xl p-4 bg-white/70 backdrop-blur-md"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-800">
                                    {c.author?.name || "Unknown"}
                                </h4>
                                <small className="text-gray-500 text-sm">
                                    {new Date(c.createdAt).toLocaleString()}
                                </small>
                            </div>

                            {editingId === c._id ? (
                                <Formik
                                    initialValues={{ content: c.content }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => handleEdit(c._id, values.content)}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="mt-2">
                                            <Field
                                                name="content"
                                                as="textarea"
                                                className="w-full border border-gray-300 rounded-lg p-2"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="bg-forest text-white px-3 py-1 rounded-lg"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            ) : (
                                <p className="text-gray-700 mt-1">{c.content}</p>
                            )}

                            <div className="flex items-center gap-3 mt-2 text-sm">
                                <button
                                    onClick={() => toggleLike(c._id)}
                                    className="text-gray-600 hover:text-forest"
                                >
                                    ❤️ {c.likes?.length || 0}
                                </button>

                                {user && c.author?._id === user.id && (
                                    <>
                                        <button
                                            onClick={() => setEditingId(c._id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteComment(c._id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
