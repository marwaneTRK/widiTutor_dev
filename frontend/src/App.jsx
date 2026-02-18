import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
 
import AuthLast from "./pages/authLast";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLast />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
}
export default App;
