import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const signupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short").required("Required"),
  email: Yup.string().email("Invalid Email").required("Required"),
  password: Yup.string().min(6, "At least 6 characters").required("Required"),
});

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7CED7] via-[#F0E5EF] to-[#CDE7FF] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg p-10 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-900 text-center tracking-wide mb-6"
        >
          Create Account ✨
        </motion.h2>

        {/* Form */}
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={signupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await signup({
                name: values.name,
                email: values.email,
                password: values.password,
              });
              navigate("/");
            } catch (err) {
              alert("Registration failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-gray-800 font-semibold mb-1 block">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-[#6A85FF] outline-none"
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-800 font-semibold mb-1 block">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-[#6A85FF] outline-none"
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-800 font-semibold mb-1 block">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-[#6A85FF] outline-none"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6A85FF] to-[#A777FF] text-white font-semibold shadow-lg hover:shadow-xl transition backdrop-blur-lg"
              >
                {isSubmitting ? "Creating..." : "Sign Up"}
              </motion.button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#6A85FF] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
