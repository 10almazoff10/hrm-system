import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Card, Form, Button, Alert, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { User, Building2, Shield } from 'lucide-react';
import api from '../utils/api.js';
import { getGravatarUrl } from '../utils/gravatar.js';
import '../styles/Profile.css';




const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    companyId: '',
    positionId: '',
    positionName: ''
  });

  const [companies, setCompanies] = useState([]); // Все компании
  const [positions, setPositions] = useState([]); // Должности выбранной компании
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const avatarUrl = getGravatarUrl(userData.username, 160);


  const navigate = useNavigate();

  // 1. Первичная загрузка данных (Профиль + Список всех компаний)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, compRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/companies')
        ]);


        const user = userRes.data;
        setUserData({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          companyId: user.companyId || '',
          positionId: user.positionId || '',
          positionName: user.positionName || '',
        });
        setCompanies(compRes.data);
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Загрузка должностей при изменении компании
  useEffect(() => {
    const fetchPositions = async () => {
      if (!userData.companyId) {
        setPositions([]);
        return;
      }
      try {
        const response = await api.get('/user/positions', {
          params: { companyId: userData.companyId }
        });
        setPositions(response.data);
      } catch (err) {
        console.error('Ошибка загрузки должностей');
      }
    };
    fetchPositions();
  }, [userData.companyId]);

  useEffect(() => {
    const loadAvatar = async () => {
      // userData.username у нас используется как email/логин
      const url = await getGravatarUrl(userData.username, 160);
      setAvatarUrl(url);
    };
    if (userData.username) loadAvatar();
  }, [userData.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'companyId') {
      setUserData(prev => ({ ...prev, [name]: value, positionId: '' }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        positionId: userData.positionId || null,
        ...(newPassword && { password: newPassword })
      };

      await api.put('/user/profile', updateData);
      setSuccess('Профиль успешно обновлен ✨');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка обновления');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
  );

  return (
      <div className="py-4 bg-light min-vh-100">
        <Container fluid className="px-4">
          {/* Заголовок страницы */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center mb-3">
                <User size={32} className="me-3 text-primary" />
                <div>
                  <h1 className="mb-1 fw-bold">Мой профиль</h1>
                  <p className="text-muted mb-0">Управление личными данными</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="shadow-lg border-0 overflow-hidden h-100">
                {/* Хедер с аватаркой и именем */}
                <div className="bg-gradient-primary text-white p-5 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-4">
                    <Badge bg="light" text="dark" className="fs-6 px-3 py-2 fw-semibold">
                      {userData.username}
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-4">
                    <div className="flex-shrink-0 position-relative">
                      <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="rounded-circle shadow-lg border border-5 border-white"
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover'
                          }}
                      />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h2 className="fw-bold mb-2 lh-sm">{userData.firstName} {userData.lastName}</h2>
                      <Badge
                          bg="light"
                          text="dark"
                          className="px-3 py-2 fw-semibold me-2 mb-2 shadow-sm"
                      >
                        {userData.positionName || 'Сотрудник'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Card.Body className="p-5">
                  {/* Уведомления */}
                  {error && (
                      <Alert variant="danger" className="mb-4 shadow-sm">
                        {error}
                      </Alert>
                  )}
                  {success && (
                      <Alert variant="success" className="mb-4 shadow-sm">
                        {success}
                      </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Личная информация */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 d-flex align-items-center">
                        <User size={20} className="me-2 text-primary" />
                        Личная информация
                      </h5>

                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Имя
                          </Form.Label>
                          <Form.Control
                              name="firstName"
                              value={userData.firstName}
                              onChange={handleChange}
                              className="shadow-sm"
                              required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Фамилия
                          </Form.Label>
                          <Form.Control
                              name="lastName"
                              value={userData.lastName}
                              onChange={handleChange}
                              className="shadow-sm"
                              required
                          />
                        </Col>
                      </Row>
                    </div>

                    {/* Компания и должность */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 d-flex align-items-center">
                        <Building2 size={20} className="me-2 text-primary" />
                        Работа
                      </h5>

                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Компания
                          </Form.Label>
                          <Form.Select
                              name="companyId"
                              value={userData.companyId}
                              onChange={handleChange}
                              className="shadow-sm"
                              required
                          >
                            <option value="">Выберите компанию</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Должность
                          </Form.Label>
                          <Form.Select
                              name="positionId"
                              value={userData.positionId}
                              onChange={handleChange}
                              disabled={!userData.companyId}
                              className="shadow-sm"
                              required
                          >
                            <option value="">
                              {userData.companyId ? 'Выберите должность' : 'Сначала выберите компанию'}
                            </option>
                            {positions.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </div>

                    {/* Пароль */}
                    <div className="mb-5">
                      <h5 className="fw-bold mb-4 d-flex align-items-center">
                        <Shield size={20} className="me-2 text-primary" />
                        Безопасность
                      </h5>

                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Новый пароль
                          </Form.Label>
                          <Form.Control
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Без изменений"
                              className="shadow-sm"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label className="fw-semibold small text-uppercase tracking-wide text-muted mb-2">
                            Подтверждение
                          </Form.Label>
                          <Form.Control
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="shadow-sm"
                          />
                        </Col>
                      </Row>
                    </div>

                    {/* Кнопки */}
                    <div className="d-flex gap-3 pt-3">
                      <Button
                          variant="primary"
                          type="submit"
                          disabled={updating}
                          className="px-5 py-2 fw-bold shadow-lg flex-grow-1 hover-lift"
                      >
                        {updating && <Spinner size="sm" className="me-2" />}
                        Сохранить изменения
                      </Button>
                      <Button
                          variant="outline-secondary"
                          as={Link}
                          to="/"
                          className="px-5 py-2 fw-semibold shadow-sm hover-lift"
                      >
                        Отмена
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default Profile;
