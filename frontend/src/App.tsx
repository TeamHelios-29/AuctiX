import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/Login';
import WalletPage from './pages/Wallet';
import SellerProfile from './pages/SellerProfile'; 

const App: React.FC = () => {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">
                <LoginPage />
              </Link>
            </li>
          </ul>
        </nav> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/seller" element={<SellerProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home: React.FC = () => <h2>Home</h2>;

export default App;

