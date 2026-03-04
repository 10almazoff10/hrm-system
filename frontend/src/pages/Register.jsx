import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api.js';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (userData.password !== userData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', userData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col md={8} lg={5} xl={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-success">Регистрация</h2>
                  <p className="text-muted small">Создайте аккаунт для учета отпусков</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label className="small fw-semibold">Имя</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Иван"
                            value={userData.firstName}
                            onChange={handleChange}
                            required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label className="small fw-semibold">Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Иванов"
                            value={userData.lastName}
                            onChange={handleChange}
                            required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="small fw-semibold">Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="ivanov.i@company.com"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="small fw-semibold">Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Придумайте пароль"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="small fw-semibold">Подтвердите пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Повторите пароль"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                  </Form.Group>

                  <Button
                      variant="success"
                      type="submit"
                      className="w-100 py-2 mb-3 fw-bold shadow-sm"
                      disabled={loading}
                  >
                    {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Создаем аккаунт...
                        </>
                    ) : 'Зарегистрироваться'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <span className="text-muted small">Уже есть аккаунт? </span>
                  <Link to="/login" className="text-decoration-none small fw-bold text-success">
                    Войти
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default Register;
