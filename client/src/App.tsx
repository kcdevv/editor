import { Route, Routes } from "react-router-dom";
import Code from "./pages/Code";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/:roomId" Component={Code} />
    </Routes>
  )
};

export default App;
