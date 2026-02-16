import { Routes, Route } from "react-router-dom";
import TestMern from "./components/testMern";

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<TestMern />} />
    </Routes>
  );
}

export default App;
