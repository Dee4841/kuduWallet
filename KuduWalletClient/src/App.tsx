import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./controllers/userController";
import Home from "./controllers/home";
import LandPage from "./controllers/dashboard";
import './App.css';
import AuthCallback from "./auth/authcallback";
import { TopUpPage } from "./controllers/TopUP/TopUpPage";

function App() {
  return (
    <Router>
          <section>
       
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<LandPage />} />
            <Route path="/Users" element={<Users />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/topUpPage" element = {<TopUpPage />} />
        </Routes>
 
    </section>

    </Router>
  );
}

export default App;
