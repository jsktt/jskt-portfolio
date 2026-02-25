
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Blog from './components/Blog/Blog'
import Project from './components/Project/Project'
import About from './components/About/About'
import Login from './components/Login/Login'
import Home from './pages/Home/Home'
import ProjectForm from './pages/Project/ProjectForm'
import ProjectDetail from './pages/ProjectDetail/ProjectDetail'

function App() {
 

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create_project" element={<ProjectForm />} />

        </Routes>
      </BrowserRouter>
    </div>
   
  )
}

export default App
