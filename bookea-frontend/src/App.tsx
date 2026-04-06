import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminBlogPage } from './modules/blog/pages/AdminBlogPage';
import { BlogDetailPage } from './modules/blog/pages/BlogDetailPage';
import { BlogPage } from './modules/blog/pages/BlogPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/admin" element={<AdminBlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;