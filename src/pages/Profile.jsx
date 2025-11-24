import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const profileSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
});

const Profile = () => {
  const { user, updateProfile, getStats } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ postCount: 0, likeCount: 0, commentCount: 0 });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadStats = async () => {
      const data = await getStats();
      setStats(data);
    };

    loadStats();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7CED7] via-[#F0E5EF] to-[#CDE7FF] flex items-center justify-center px-6 py-20">

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/30 backdrop-blur-xl shadow-2xl border border-white/40 rounded-3xl p-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">My Profile</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 justify-between">

          {/* AVATAR */}
          <motion.div whileHover={{ scale: 1.05 }} className="w-40 h-40 rounded-full overflow-hidden shadow-xl border-4 border-white/50">
            <img
              src={user.avatar?.url || user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* INFO + STATS */}
          <div className="flex-1 space-y-6">

            {/* Name */}
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-xl font-semibold text-gray-800">{user.name}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-xl font-semibold text-gray-800">{user.email}</p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white/40 backdrop-blur-xl p-4 text-center rounded-xl shadow">
                <p className="text-2xl font-bold text-[#6A85FF]">{stats.postCount}</p>
                <p className="text-gray-700 text-sm">Posts</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl p-4 text-center rounded-xl shadow">
                <p className="text-2xl font-bold text-pink-500">{stats.likeCount}</p>
                <p className="text-gray-700 text-sm">Likes</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl p-4 text-center rounded-xl shadow">
                <p className="text-2xl font-bold text-green-600">{stats.commentCount}</p>
                <p className="text-gray-700 text-sm">Comments</p>
              </div>
            </div>

            {/* EDIT BTN */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                setAvatarPreview(null);
                setIsModalOpen(true);
              }}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#6A85FF] to-[#A777FF] text-white font-semibold shadow-lg"
            >
              Edit Profile
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/70 backdrop-blur-xl w-full max-w-lg p-8 rounded-3xl shadow-xl border border-white/30 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

            <Formik
              initialValues={{
                name: user.name,
                email: user.email,
                password: "",
                avatar: null,
              }}
              validationSchema={profileSchema}
              onSubmit={async (values) => {
                await updateProfile({
                  name: values.name,
                  password: values.password,
                  avatar: avatarPreview,
                });

                setIsModalOpen(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-5">

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        avatarPreview
                          ? URL.createObjectURL(avatarPreview)
                          : user.avatar?.url || user.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <input
                      type="file"
                      className="mt-3"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setAvatarPreview(file);
                        setFieldValue("avatar", file);
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="font-medium">Name</label>
                    <Field
                      name="name"
                      className="w-full p-3 rounded-xl border bg-white/60 focus:ring-2"
                    />
                  </div>

                  {/* Email (NOT EDITABLE) */}
                  <div>
                    <label className="font-medium">Email</label>
                    <input
                      value={user.email}
                      disabled
                      className="w-full p-3 rounded-xl border bg-gray-200 cursor-not-allowed"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="font-medium">New Password (Optional)</label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      className="w-full p-3 rounded-xl border bg-white/60 focus:ring-2"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
                  >
                    Save Changes
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2 rounded-xl text-gray-700"
                  >
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
