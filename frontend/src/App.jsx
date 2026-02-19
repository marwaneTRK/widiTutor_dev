import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import TestHome from "./components/testMern";  
import AuthLast from "./pages/authLast";
import HomePage from "./pages/HomePage";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLast />} />
      <Route path="/testMern" element={<TestHome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/homePage" element={<HomePage />} />
    </Routes>
  );
}
export default App;
