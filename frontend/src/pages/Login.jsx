import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api.js';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверное имя пользователя или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Вход в систему</h2>
                  <p className="text-muted small">Внутрений портал компании</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="small fw-semibold">Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Введите Email"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="small fw-semibold">Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                  </Form.Group>

                  <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-2 mb-3 fw-bold"
                      disabled={loading}
                  >
                    {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Входим...
                        </>
                    ) : 'Войти'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <span className="text-muted small">Нет аккаунта? </span>
                  <Link to="/register" className="text-decoration-none small fw-bold">
                    Зарегистрироваться
                  </Link>
                </div>
              </Card.Body>
            </Card>
            <div className="text-center mt-4 text-muted small">
              &copy; {new Date().getFullYear()} Prokin.Dev
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Login;
