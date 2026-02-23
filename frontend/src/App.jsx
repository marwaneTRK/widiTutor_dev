import { BrowserRouter, Routes, Route } from "react-router-dom";
 
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import WidiWorks from "./pages/WidiWorks";
import InfoWidi from "./pages/InfoWidi";
import About from "./pages/About";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
 
      <Route path="/" element={<HomePage />} />
     
    </Routes>
  );
}
export default App;
