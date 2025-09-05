import Dashboard from "../Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/event/:eventId/:isEng?" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
