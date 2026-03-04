import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreateVacation from './pages/CreateVacation';
import Layout from './components/Layout';
import Galery from './pages/Galery.jsx';
import Collegues from './pages/Collegues.jsx';

import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* Публичные роуты */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Защищенные роуты */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/vacation/new" element={<CreateVacation />} />
                        <Route path="/vacation/edit/:id" element={<CreateVacation />} />
                        <Route path="/galery" element={<Galery />} />
                        <Route path="/collegues" element={<Collegues />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;