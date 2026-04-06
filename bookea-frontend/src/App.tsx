import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MiniChat from "./mini chat/MiniChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/*" element={<MiniChat />} />
        <Route path="*" element={<Navigate to="/chat/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
