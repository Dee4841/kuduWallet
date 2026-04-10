import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./controllers/userController";

import './App.css';

function App() {
  return (
    <Router>
          <section>
            <h2>Now printing names</h2>
        <Routes>
            <Route path="/" element={<Users />} />
        </Routes>
 
    </section>

    </Router>
  );
}

export default App;
