import { useLocation, Link, useNavigate, Outlet } from 'react-router-dom';
import { Nav, Button, Navbar, Offcanvas } from 'react-bootstrap';
import {LayoutDashboard, User, Plane, LogOut, Menu, X, Camera, Users} from 'lucide-react';
import '../styles/Dashboard.css';
import { getGravatarUrl } from '../utils/gravatar.js';
import {useEffect, useState} from "react";
import api from "../utils/api.js";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        companyId: '',
        positionId: ''
    });
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes] = await Promise.all([
                    api.get('/user/profile'),
                ]);

                const user = userRes.data;
                setUserData({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            } catch (err) {
                console.error('Не удалось загрузить данные профиля', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-light min-vh-100 d-flex">
            {/* Мобильное бургер-меню */}
            <Navbar
                className="d-lg-none fixed-top bg-white shadow-sm border-bottom p-2"
                style={{ zIndex: 1040 }}
            >
                <Button
                    variant="link"
                    className="p-0 border-0 shadow-none"
                    onClick={() => setShowSidebar(true)}
                >
                    <Menu size={24} />
                </Button>
            </Navbar>

            {/* Sidebar Offcanvas для мобильных */}
            <Offcanvas
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                placement="start"
                className="d-lg-none"
            >
                <Offcanvas.Header closeButton closeVariant="white" className="bg-primary">
                    <Offcanvas.Title className="text-white fw-bold">
                        Company name
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <div className="px-3 py-4">
                        <div className="text-center mb-4">
                            <img
                                src={getGravatarUrl(userData.username, 40)}
                                className="rounded-circle me-2"
                                alt="user"
                                style={{ width: 40, height: 40 }}
                            />
                            <div className="small fw-bold mt-2">
                                {userData.firstName} {userData.lastName}
                            </div>
                        </div>

                        <Nav className="flex-column mb-4">
                            <Nav.Link as={Link} to="/" onClick={() => setShowSidebar(false)} className={isActive('/') ? 'active' : ''}>
                                <LayoutDashboard size={20} className="me-3" />
                                Главная
                            </Nav.Link>
                            <Nav.Link as={Link} to="/profile" onClick={() => setShowSidebar(false)} className={isActive('/profile') ? 'active' : ''}>
                                <User size={20} className="me-3" />
                                Мой профиль
                            </Nav.Link>
                            <Nav.Link as={Link} to="/vacation/new" onClick={() => setShowSidebar(false)}
                                      className={isActive('/vacation/new') || location.pathname.includes('/vacation/edit') ? 'active' : ''}>
                                <Plane size={20} className="me-3" />
                                Мой отпуск
                            </Nav.Link>
                            <Nav.Link as={Link} to="/collegues" onClick={() => setShowSidebar(false)}
                                      className={isActive('/collegues') || location.pathname.includes('/collegues') ? 'active' : ''}>
                                <Users size={20} className="me-3" />
                                Мои коллеги (demo)
                            </Nav.Link>
                            <Nav.Link as={Link} to="/galery" onClick={() => setShowSidebar(false)}
                                      className={isActive('/galery') || location.pathname.includes('/galery') ? 'active' : ''}>
                                <Camera size={20} className="me-3" />
                                Галерея (demo)
                            </Nav.Link>
                        </Nav>

                        <Button
                            variant="link"
                            onClick={handleLogout}
                            className="nav-link logout-link text-danger border-0 w-100 text-start"
                        >
                            <LogOut size={20} className="me-3" />
                            Выйти
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Основной десктопный sidebar (скрыт на мобильных) */}
            <aside className="sidebar shadow-sm d-none d-lg-block">
                <div className="mb-5 px-2">
                    <h4 className="fw-bold text-primary mb-0">Компания</h4>
                    <small className="text-muted small">Внутренний портал</small>
                </div>

                <div className="mb-4 text-center px-3">
                    <img
                        src={getGravatarUrl(userData.username, 40)}
                        className="rounded-circle me-2"
                        alt="user"
                    />
                    <span className="small fw-bold">{userData.firstName} {userData.lastName}</span>
                </div>

                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/" className={isActive('/') ? 'active' : ''}>
                        <LayoutDashboard size={20} className="me-3" />
                        Главная
                    </Nav.Link>
                    <Nav.Link as={Link} to="/profile" className={isActive('/profile') ? 'active' : ''}>
                        <User size={20} className="me-3" />
                        Мой профиль
                    </Nav.Link>
                    <Nav.Link as={Link} to="/vacation/new" className={isActive('/vacation/new') || location.pathname.includes('/vacation/edit') ? 'active' : ''}>
                        <Plane size={20} className="me-3" />
                        Мой отпуск
                    </Nav.Link>
                    <Nav.Link as={Link} to="/collegues" className={isActive('/collegues') || location.pathname.includes('/collegues') ? 'active' : ''}>
                        <Users size={20} className="me-3" />
                        Мои коллеги (demo)
                    </Nav.Link>
                    <Nav.Link as={Link} to="/galery" className={isActive('/galery') || location.pathname.includes('/galery') ? 'active' : ''}>
                        <Camera size={20} className="me-3" />
                        Галерея (demo)
                    </Nav.Link>
                </Nav>

                <Button variant="link" onClick={handleLogout} className="nav-link logout-link text-danger border-0 w-100 text-start mt-auto">
                    <LogOut size={20} className="me-3" />
                    Выйти
                </Button>
            </aside>

            {/* Основной контент */}
            <div className="main-wrapper flex-grow-1 pt-lg-0 pt-5">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
