import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { CloudSun, Clock, MapPin } from 'lucide-react';
import api from '../utils/api.js';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: null, city: 'Барнаул', loading: true });
  const [loading, setLoading] = useState(true);


  // 1. Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Получение погоды (Open-Meteo API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Координаты Барнаула (пример)
        const lat = 53.36;
        const lon = 83.76;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        setWeather(prev => ({ ...prev, temp: Math.round(data.current_weather.temperature), loading: false }));
      } catch (err) {
        console.error("Ошибка погоды", err);
        setWeather(prev => ({ ...prev, loading: false }));
      }
    };
    fetchWeather();
  }, []);

  return (
      <div className="py-4">
        <Container fluid className="px-4">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold mb-1">Панель управления</h2>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Приветствие */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm p-4 h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <h4 className="fw-semibold mb-3 text-primary">Здравствуйте!</h4>
                  <p className="text-secondary leading-relaxed mb-0">
                    Приветствуем вас на внутреннем портале компании!
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Виджет Погоды и Времени */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm bg-white h-100 overflow-hidden">
                <Card.Body className="p-0 d-flex flex-column">
                  {/* Секция времени */}
                  <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
                    <div>
                      <div className="text-uppercase small fw-bold text-muted mb-1 ls-wide">Текущее время</div>
                      <h3 className="fw-bold mb-0 text-dark">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </h3>
                    </div>
                    <Clock size={32} className="text-primary opacity-50" />
                  </div>

                  {/* Секция погоды */}
                  <div className="p-4 d-flex align-items-center justify-content-between">
                    <div>
                      <div className="d-flex align-items-center text-muted small fw-bold mb-1">
                        <MapPin size={14} className="me-1" /> {weather.city}
                      </div>
                      {weather.loading ? (
                          <Spinner animation="border" size="sm" variant="primary" />
                      ) : (
                          <h3 className="fw-bold mb-0">
                            {weather.temp !== null ? `${weather.temp}°C` : '--'}
                          </h3>
                      )}
                    </div>
                    <CloudSun size={32} className="text-warning" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default Dashboard;
