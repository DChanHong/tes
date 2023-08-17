import { Route, Routes } from "react-router-dom";
import Index2 from "./pages/Index2";
import Index from "pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/2" element={<Index2 />} />
    </Routes>
  );
}

export default App;
