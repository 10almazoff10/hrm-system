import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, InputGroup, Form, Badge, Button, Dropdown } from 'react-bootstrap';
import { Search, Filter, Users, Building2, MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';

const Collegues = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [colleagues, setColleagues] = useState([]);

    // Пример данных (замени на API)
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                name: 'Олег Прокин',
                username: 'prokin.o',
                position: 'Senior DevOps',
                department: 'IT',
                avatar: 'https://www.gravatar.com/avatar/a5cf6845e46d0d227b286bcfa726b512?s=160&d=mp',
                location: 'Барнаул',
                phone: '+7 (963) 555-55-55',
                email: 'prokin.rt@gmail.com',
                telegram: 'mynamecat'
            }
        ];
        setColleagues(mockData);
    }, []);
    const filteredColleagues = colleagues.filter(colleague =>
        colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (departmentFilter === 'all' || colleague.department === departmentFilter)
    );

    const departments = ['all', 'IT', 'HR', 'Sales', 'Marketing'];

    return (
        <div className="py-4 bg-light min-vh-100">
            <Container fluid className="px-4">
                {/* Заголовок */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex align-items-center mb-3">
                            <Users size={32} className="me-3 text-primary" />
                            <div>
                                <h1 className="mb-1 fw-bold">Мои коллеги</h1>
                                <p className="text-muted mb-0">Познакомьтесь с коллегами, узнайте их должности и зоны ответственности</p>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Поиск и фильтры */}
                <Row className="mb-4">
                    <Col md={8} lg={6}>
                        <InputGroup className="shadow-sm">
                            <InputGroup.Text className="bg-white border-end-0">
                                <Search size={18} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Поиск по имени или должности..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={4} lg={3}>
                        <Dropdown>
                            <Dropdown.Toggle className="w-100 shadow-sm text-start">
                                <Filter size={16} className="me-1 mb-1" />
                                Отдел {departmentFilter !== 'all' ? `: ${departmentFilter}` : ''}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                {departments.map(dept => (
                                    <Dropdown.Item
                                        key={dept}
                                        onClick={() => setDepartmentFilter(dept)}
                                        active={departmentFilter === dept}
                                    >
                                        {dept === 'all' ? 'Все отделы' : dept}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                {/* Карточки коллег */}
                <Row className="g-4">
                    {filteredColleagues.length > 0 ? (
                        filteredColleagues.map((colleague) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={colleague.id}>
                                <Card className="h-100 shadow-sm border-0 hover-lift">
                                    <Card.Body className="p-4 d-flex flex-column">
                                        {/* Аватар и базовая информация */}
                                        <div className="text-center mb-4 flex-shrink-0">
                                            <div className="position-relative">
                                                <img
                                                    src={colleague.avatar}
                                                    className="rounded-circle mx-auto shadow"
                                                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                    alt={colleague.name}
                                                />
                                                <Badge
                                                    bg="primary"
                                                    className="position-absolute bottom-0 end-0 border border-white rounded-circle"
                                                    style={{ width: 24, height: 24 }}
                                                >
                                                    {colleague.department[0]}
                                                </Badge>
                                            </div>
                                            <h6 className="mt-3 mb-1 fw-bold">{colleague.name}</h6>
                                            <p className="text-muted small mb-0">{colleague.position}</p>
                                        </div>

                                        {/* Отдел и локация */}
                                        <div className="flex-grow-1 mb-3">
                                            <div className="d-flex align-items-center mb-2 small">
                                                <Building2 size={14} className="me-2 text-muted flex-shrink-0" />
                                                <span className="text-truncate">{colleague.department}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-3 small">
                                                <MapPin size={14} className="me-2 text-muted flex-shrink-0" />
                                                <span>{colleague.location}</span>
                                            </div>
                                        </div>

                                        {/* Кнопки контактов - единый стиль */}
                                        <div className="d-flex flex-column gap-2 mt-auto">
                                            {/* Telegram */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="p-2 text-start border rounded-pill shadow-sm hover-lift"
                                                onClick={() => window.open(`https://t.me/${colleague.telegram}`, '_blank')}
                                            >
                                                <Send size={14} className="me-2 text-success" />
                                                <span className="small">@{colleague.telegram}</span>
                                            </Button>

                                            {/* Mattermost */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="p-2 text-start border rounded-pill shadow-sm hover-lift"
                                                onClick={() => {
                                                    const mmUrl = `mattermost://mm.company/company/messages/@${colleague.username}`;
                                                    window.location.href = mmUrl;
                                                }}
                                            >
                                                <Mail size={14} className="me-2 text-primary" />
                                                <span className="small">@{colleague.username}</span>
                                            </Button>

                                            {/* Телефон (опционально) */}
                                            {colleague.phone && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="p-2 text-start border rounded-pill shadow-sm hover-lift"
                                                    onClick={() => window.open(`tel:${colleague.phone.replace(/\s/g, '')}`, '_blank')}
                                                >
                                                    <Phone size={14} className="me-2 text-info" />
                                                    <span className="small">{colleague.phone}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <div className="text-center py-5">
                                <Users size={64} className="text-muted mb-3 opacity-50" />
                                <h4 className="text-muted">Коллеги не найдены</h4>
                                <p className="text-muted">Попробуйте изменить поисковый запрос или фильтр</p>
                            </div>
                        </Col>
                    )}
                </Row>

            </Container>
        </div>
    );
};

export default Collegues;
