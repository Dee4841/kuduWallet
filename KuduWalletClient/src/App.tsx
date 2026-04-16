import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./controllers/userController";
import Home from "./controllers/home";
import LandPage from "./controllers/landingPage";
import './App.css';
import AuthCallback from "./auth/authcallback";

function App() {
  return (
    <Router>
          <section>
       
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landingPage" element={<LandPage />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
 
    </section>

    </Router>
  );
}

export default App;
