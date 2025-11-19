import * as Yup from "yup";

export const postValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title too long")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters long")
    .required("Content is required"),
  category: Yup.string().max(50, "Category name too long").nullable(),
});
