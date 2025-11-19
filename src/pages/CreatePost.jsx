import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import { usePosts } from "../context/PostContext";
import GlassCategorySelect from "../components/CategorySelect";
import { Image as ImageIcon } from "lucide-react";

// Validation schema
const PostSchema = Yup.object().shape({
    title: Yup.string().trim().min(3).required("Title is required"),
    content: Yup.string().trim().min(10).required("Content is required"),
    category: Yup.string().required("Category is required"),
});

const CreatePost = () => {
    const { createPost } = usePosts();

    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await axiosInstance.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUploading(false);
            return res.data;
        } catch (err) {
            console.error("Upload error:", err);
            setUploading(false);
            return null;
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-10 bg-gradient-to-br from-[#f6e9f9] to-[#e7f4ff] flex justify-center items-start">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="
          w-full 
          max-w-4xl 
          bg-white/30 
          backdrop-blur-xl 
          border border-white/50 
          shadow-2xl 
          rounded-3xl 
          p-10
        "
            >
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
                    ✍️ Create a New Post
                </h1>

                <Formik
                    initialValues={{
                        title: "",
                        content: "",
                        category: "",
                        image: null,
                    }}
                    validationSchema={PostSchema}
                    onSubmit={async (values, { resetForm }) => {
                        let uploadedImage = null;

                        if (values.image) {
                            uploadedImage = await uploadImage(values.image);
                        }

                        await createPost({
                            title: values.title,
                            content: values.content,
                            category: values.category,
                            image: uploadedImage,
                        });

                        resetForm();
                        setImagePreview(null);
                    }}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form className="space-y-6">

                            {/* TITLE */}
                            <div>
                                <label className="text-gray-700 font-medium">Title</label>
                                <Field
                                    name="title"
                                    type="text"
                                    placeholder="Enter a stunning title..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 focus:ring-2 focus:ring-blue-300 outline-none shadow-inner"
                                />
                                <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="text-gray-700 font-medium">Category</label>
                                <GlassCategorySelect
                                    onChange={(v) => setFieldValue("category", v)}
                                />
                                <ErrorMessage name="category" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* CONTENT */}
                            <div>
                                <label className="text-gray-700 font-medium">Content</label>
                                <Field
                                    as="textarea"
                                    name="content"
                                    placeholder="Start writing your story..."
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 focus:ring-2 focus:ring-blue-300 outline-none shadow-inner resize-none"
                                />
                                <ErrorMessage name="content" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* IMAGE UPLOAD */}
                            <div>
                                <label className="text-gray-700 font-medium flex items-center gap-2">
                                    <ImageIcon size={18} /> Upload Image
                                </label>

                                <div
                                    className="
                    mt-2 flex items-center justify-center
                    border-2 border-dashed border-white/50
                    p-6 rounded-2xl bg-white/20 backdrop-blur-xl cursor-pointer
                    hover:bg-white/30 transition
                  "
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setFieldValue("image", file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }}
                                        className="w-full text-sm text-gray-700 cursor-pointer"
                                    />
                                </div>

                                {imagePreview && (
                                    <motion.img
                                        src={imagePreview}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 rounded-2xl w-full h-64 object-cover shadow-xl"
                                    />
                                )}
                            </div>

                            {/* BUTTON */}
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.96 }}
                                disabled={isSubmitting || uploading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-xl hover:shadow-2xl transition"
                            >
                                {uploading || isSubmitting ? "Publishing..." : "Publish Post 🚀"}
                            </motion.button>

                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
};

export default CreatePost;
