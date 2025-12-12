import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SinglePost from "./pages/SinglePost";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// App.jsx (updated wrapper)
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <PostProvider>
            <CommentProvider>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-[#0b1220] dark:to-[#071025] text-text-light dark:text-text-dark transition-colors duration-500">
                <Navbar />
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<SinglePost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/create" element={<CreatePost />} />
                      <Route path="/edit/:id" element={<EditPost />} />
                      <Route path="/myposts" element={<MyPosts />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Routes>
                </div>
                <Footer />
              </div>
            </CommentProvider>
          </PostProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}


export default App;
