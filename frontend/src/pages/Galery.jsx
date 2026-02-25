import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Modal, Button, Dropdown, Nav } from 'react-bootstrap';
import { Image, Video, Calendar, Grid3X3, MapPin, Users, Camera } from 'lucide-react';
import '../styles/Galery.css';

const Galery = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [activeEvent, setActiveEvent] = useState('corporate');

    // Данные событий
    const events = {
        corporate: {
            title: 'Корпоратив 2025',
            date: '20 декабря 2025',
            location: 'Ресторан "Золотой дракон"',
            photos: 127,
            videos: 8,
            items: [
                { id: 1, type: 'photo', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Танцы на корпоративе' },
                { id: 2, type: 'video', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Приветствие директора' },
                { id: 3, type: 'photo', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Банкетный зал' },
                { id: 4, type: 'photo', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Фото с подарками' },
                { id: 5, type: 'photo', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Коллективное фото' },
                { id: 6, type: 'video', src: 'https://img.freepik.com/free-photo/aerial-view-colorful-mixed-forest-shrouded-morning-fog-beautiful-autumn-day_1153-3817.jpg?t=st=1771688765~exp=1771692365~hmac=86929a6914604fe5e47ef8b24569c4212f787e9e2369dfab4b09d6b53822a1aa&w=1060', alt: 'Лотерея' }
            ]
        },
        team_building: {
            title: 'Тимбилдинг',
            date: '15 ноября 2025',
            location: 'База отдыха "Лесная поляна"',
            photos: 89,
            videos: 12,
            items: [
                { id: 7, type: 'photo', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7XT2M24uFGW6UUucxyFrpe2N8UXjgWqSrVQ&s', alt: 'Квест в лесу' },
                { id: 8, type: 'photo', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7XT2M24uFGW6UUucxyFrpe2N8UXjgWqSrVQ&s', alt: 'Пикник' },
                { id: 9, type: 'video', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7XT2M24uFGW6UUucxyFrpe2N8UXjgWqSrVQ&s', alt: 'Мастер-класс' }
            ]
        },
        new_year: {
            title: 'Новогодний вечер',
            date: '28 декабря 2025',
            location: 'Офис компании',
            photos: 156,
            videos: 5,
            items: [
                { id: 10, type: 'photo', src: 'https://www.gctc.ru/media/images/education/general/cosmos_1.jpg', alt: 'Новогодняя елка' },
                { id: 11, type: 'photo', src: 'https://www.gctc.ru/media/images/education/general/cosmos_1.jpg', alt: 'Дед Мороз' }
            ]
        }
    };

    const currentEvent = events[activeEvent];

    return (
        <div className="py-4 bg-light min-vh-100">
            <Container fluid className="px-4">
                {/* Заголовок */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex align-items-center mb-3">
                            <Camera size={32} className="me-3 text-primary" />
                            <div>
                                <h1 className="mb-1 fw-bold">Фотогалерея</h1>
                                <p className="text-muted mb-0">Воспоминания о наших событиях</p>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Переключатель событий */}
                <Row className="mb-4">
                    <Col lg={8}>
                        <Nav variant="tabs" className="flex-row flex-lg-nowrap overflow-auto">
                            {Object.entries(events).map(([key, event]) => (
                                <Nav.Item key={key}>
                                    <Nav.Link
                                        className={`border-0 rounded-pill px-4 py-2 mx-1 ${activeEvent === key ? 'active shadow-sm bg-primary text-white' : 'text-muted'}`}
                                        onClick={() => setActiveEvent(key)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <Calendar size={16} className="me-2" />
                                            <span className="small fw-bold">{event.title}</span>
                                            <Badge bg="secondary" className="ms-2">{event.photos + event.videos}</Badge>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                </Row>

                {/* Информация о событии */}
                <Row className="mb-4">
                    <Col md={6} lg={4}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-start mb-3">
                                    <div className="flex-shrink-0">
                                        <Calendar size={24} className="text-primary me-3" />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">{currentEvent.title}</h5>
                                        <p className="text-muted small mb-1">{currentEvent.date}</p>
                                        <p className="text-muted small mb-0">
                                            <MapPin size={14} className="me-1" />
                                            {currentEvent.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <div className="text-center">
                                        <div className="fw-bold text-primary fs-4">{currentEvent.photos}</div>
                                        <small className="text-muted">фото</small>
                                    </div>
                                    <div className="text-center">
                                        <div className="fw-bold text-success fs-4">{currentEvent.videos}</div>
                                        <small className="text-muted">видео</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Галерея */}
                <Row className="g-3">
                    {currentEvent.items.map((item) => (
                        <Col xs={6} sm={4} md={3} lg={2} key={item.id}>
                            <div
                                className="gallery-item shadow-sm hover-lift rounded position-relative overflow-hidden cursor-pointer"
                                style={{ height: 160, aspectRatio: '1/1' }}
                                onClick={() => setSelectedMedia(item)}
                            >
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-100 h-100 object-cover"
                                />
                                <div className="position-absolute top-2 end-2 p-2">
                                    {item.type === 'photo' ? (
                                        <Image size={20} className="text-white" />
                                    ) : (
                                        <Video size={20} className="text-white" />
                                    )}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Модальное окно для просмотра */}
            <Modal
                show={selectedMedia !== null}
                onHide={() => setSelectedMedia(null)}
                centered
                size="lg"
                className="gallery-modal"
            >
                <Modal.Body className="p-0">
                    {selectedMedia?.type === 'photo' ? (
                        <img
                            src={selectedMedia.src}
                            alt={selectedMedia.alt}
                            className="w-100 h-auto max-h-90vh"
                            style={{ maxHeight: '90vh', objectFit: 'contain' }}
                        />
                    ) : (
                        <video
                            src={selectedMedia?.src}
                            controls
                            className="w-100 h-auto max-h-90vh"
                            style={{ maxHeight: '90vh' }}
                        >
                            Ваш браузер не поддерживает видео
                        </video>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    <Button variant="outline-secondary" onClick={() => setSelectedMedia(null)}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Galery;
