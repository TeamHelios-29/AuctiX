import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/Login';
import CreateBidPage from './pages/create-bid';

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
          <Route path="/create-bid" element={<CreateBidPage />} />{' '}
        </Routes>
      </div>
    </Router>
  );
};

const Home: React.FC = () => <h2>Home</h2>;

export default App;
