import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProfilePage} from "./modules/user";
// Les autres pages suivront...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;