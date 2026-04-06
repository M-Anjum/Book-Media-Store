import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfilePage} from "./modules/user";
import { LoginPage } from "./modules/auth";
// Les autres pages suivront...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;