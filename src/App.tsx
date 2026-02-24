
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Blog from './components/Blog/Blog'
import Project from './components/Project/Project'
import About from './components/About/About'

function App() {
 

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projects" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </div>
   
  )
}

export default App
