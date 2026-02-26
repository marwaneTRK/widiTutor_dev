import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
export default App;
