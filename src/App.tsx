import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Blog from "./components/Blog/Blog";
// import Project from "./components/Project/Project";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Home from "./pages/Home/Home";
// import ProjectForm from "./pages/Project/ProjectForm";
// import ProjectDetail from "./pages/ProjectDetail/ProjectDetail";
import BlogForm from "./pages/BlogForm/BlogForm";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"



function App() {
  const location = useLocation(); // for deciding what stays underneath the hover
  const state = location.state as { backgroundLocation?: Location };

  return (
    <div>
      <Header />
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        <Route path="/writings" element={<Blog />} />
        <Route path="/writings/new" element={<BlogForm />} />
        <Route path="/writings/edit/:id" element={<BlogForm />} />
        <Route path="/writings/:id" element={<BlogDetail />} />

        {/* <Route path="/projects" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/edit/:id" element={<ProjectForm />} /> */}
      </Routes>
      <Analytics />
      <SpeedInsights />

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
