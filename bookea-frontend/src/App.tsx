import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfilePage} from "./modules/user";
import { LoginPage } from "./modules/auth";
import { RegisterPage } from './modules/user/pages';
// Les autres pages suivront...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;