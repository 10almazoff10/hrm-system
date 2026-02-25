import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container, Row, Col, Card, Form, Button, Alert, Navbar, Spinner, Table, Badge} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    Save,
    Users,
    Info,
    CheckCircle,
    Edit3,
    Trash2,
    AlertCircle, Plane
} from 'lucide-react';
import '../styles/CreateVacation.css';
import api from '../utils/api.js';


const CreateVacation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [vacations, setVacations] = useState([]);


    // Состояния для данных
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [events, setEvents] = useState([]);
    const [allPositions, setAllPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Состояния интерфейса
    const [loading, setLoading] = useState(true);
    const [isCalendarLoading, setIsCalendarLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Загружаем список личных отпусков
    const fetchMyVacations = async () => {
        try {
            const response = await api.get('/vacations/my');
            setVacations(response.data);
        } catch (err) {
            console.error("Ошибка загрузки отпусков", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMyVacations();
    }, [refreshKey]);

    // 1. Первичная загрузка метаданных
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userRes = await api.get('/user/profile');
                const userData = userRes.data;

                setSelectedPosition(userData.positionId);

                const posRes = await api.get('/user/positions', {
                    params: { companyId: userData.companyId }
                });
                setAllPositions(posRes.data);

                if (isEditMode) {
                    const vacationRes = await api.get(`/vacations/my`);
                    const currentVacation = vacationRes.data.find(v => v.id === parseInt(id));
                    if (currentVacation) {
                        setDates({
                            startDate: currentVacation.startDate,
                            endDate: currentVacation.endDate
                        });
                    }
                } else {
                    // Если мы НЕ в режиме редактирования (нажали Отмена или перешли на /new)
                    // Очищаем форму
                    setDates({ startDate: '', endDate: '' });
                }
            } catch (err) {
                setError('Ошибка загрузки данных');
            }
        };
        fetchInitialData();
    }, [id, isEditMode]);

    // 2. Загрузка отпусков (срабатывает при смене отдела или после сохранения)
    useEffect(() => {
        const fetchCalendar = async () => {
            if (!selectedPosition) {
                setEvents([]);
                return;
            }

            setIsCalendarLoading(true);
            try {
                const response = await api.get('/vacations/calendar', {
                    params: { positionId: selectedPosition }
                });

                const formattedEvents = (response.data || []).map(v => ({
                    id: v.id,
                    title: v.employeeName,
                    start: v.startDate,
                    end: v.endDate,
                    backgroundColor: v.status === 'APPROVED' ? '#d1e7dd' : '#fff3cd',
                    borderColor: v.status === 'APPROVED' ? '#0f5132' : '#856404',
                    textColor: '#000',
                    allDay: true
                }));
                setEvents(formattedEvents);
            } catch (err) {
                console.error('Ошибка загрузки календаря');
                setEvents([]);
            } finally {
                setTimeout(() => setIsCalendarLoading(false), 300);
            }
        };
        fetchCalendar();
    }, [selectedPosition, refreshKey]); // Добавлен refreshKey

    // Вычисляемые события
    const displayEvents = [
        ...events,
        ...(dates.startDate && dates.endDate ? [{
            title: 'Ваш выбор',
            start: dates.startDate,
            end: dates.endDate,
            backgroundColor: '#0d6efd',
            borderColor: '#0a58ca',
            textColor: '#fff',
            allDay: true,
            display: 'block'
        }] : [])
    ];
    const getStatusBadge = (status) => {
        const configs = {
            'PENDING': { bg: 'warning', text: 'Ожидает' },
            'APPROVED': { bg: 'success', text: 'Одобрен' },
            'REJECTED': { bg: 'danger', text: 'Отклонен' }
        };
        const config = configs[status] || { bg: 'secondary', text: status };
        return <Badge bg={config.bg}>{config.text}</Badge>;
    };
    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
            try {
                await api.delete(`/vacations/${id}`);
                setShowSuccess(true);
                setVacations(vacations.filter(v => v.id !== id));
                setRefreshKey(prev => prev + 1);
                setTimeout(() => setShowSuccess(false), 5000);

            } catch (err) {
                alert(err.response?.data || "Ошибка при удалении");
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(dates.startDate) > new Date(dates.endDate)) {
            setError('Дата начала не может быть позже даты окончания');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            if (isEditMode) {
                // Если мы в режиме редактирования - шлем PUT
                await api.put(`/vacations/${id}`, dates);
                setShowSuccess(true);
                // После редактирования лучше через пару секунд увести пользователя на главную
                setTimeout(() => navigate('/vacation/new'), 300);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                // Если создание - шлем POST
                await api.post('/vacations', dates);
                setShowSuccess(true);
                setDates({ startDate: '', endDate: '' });
                setRefreshKey(prev => prev + 1);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data || 'Ошибка при сохранении');
        } finally {
            setSubmitting(false);
        }
    };
    const handleCancel = () => {
        setError('');
        setShowSuccess(false);
        navigate('/vacation/new');
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="py-4">
            <Container>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex align-items-center mb-3">
                            <Plane size={32} className="me-3 text-primary" />
                            <div>
                                <h1 className="mb-1 fw-bold">Мой отпуск</h1>
                                <p className="text-muted mb-0">Оставьте заявку на отпуск, согласовав с остальными коллегами</p>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4 d-flex align-items-center">
                                    <CalendarIcon className="me-2 text-primary" size={20} />
                                    Параметры отпуска
                                </h5>

                                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                                {showSuccess && (
                                    <Alert variant="success" className="py-2 small d-flex align-items-center">
                                        <CheckCircle size={18} className="me-2" />
                                        Заявка успешно отправлена!
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">Дата начала</Form.Label>
                                        <Form.Control
                                            type="date"
                                            required
                                            value={dates.startDate}
                                            onChange={e => setDates({...dates, startDate: e.target.value})}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold">Дата окончания</Form.Label>
                                        <Form.Control
                                            type="date"
                                            required
                                            value={dates.endDate}
                                            onChange={e => setDates({...dates, endDate: e.target.value})}
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={submitting}>
                                            {submitting ? <Spinner size="sm" /> : <Save size={18} className="me-2" />}
                                            {isEditMode ? 'Сохранить изменения' : 'Отправить заявку'}
                                        </Button>
                                        {isEditMode && (
                                            <Button variant="outline-secondary" onClick={() => handleCancel()}>
                                                Отмена
                                            </Button>
                                        )}
                                    </div>

                                </Form>

                                <div className="mt-4 p-3 bg-light rounded-3 border-start border-primary border-4">
                                    <div className="d-flex align-items-center mb-1">
                                        <Info size={16} className="text-primary me-2" />
                                        <strong className="small text-dark">Информация</strong>
                                    </div>
                                    <p className="small text-muted mb-0">
                                        Синим цветом выделен ваш текущий выбор. Коллеги подгружаются автоматически.
                                    </p>
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <Card className="border-0 shadow-sm p-4">
                                    <Card.Title className="fw-bold mb-4">Созданные заявки</Card.Title>
                                    {loading ? (
                                        <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
                                    ) : vacations.length > 0 ? (
                                        <Table responsive hover className="align-middle">
                                            <thead className="table-light">
                                            <tr>
                                                <th>Период</th>
                                                <th>Статус</th>
                                                <th className="text-end">Действия</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {vacations.map(v => (
                                                <tr key={v.id}>
                                                    <td>
                                                        <span className="fw-medium">{new Date(v.startDate).toLocaleDateString()}</span>
                                                        <br/><span className="text-muted mx-2">—</span><br/>
                                                        <span
                                                            className="fw-medium">{new Date(v.endDate).toLocaleDateString()}</span>
                                                    </td>
                                                    <td>{getStatusBadge(v.status)}</td>
                                                    <td className="text-end">
                                                        {/* Редактирование (пока можно сделать переход на ту же страницу с ID) */}
                                                        <Button variant="link" className="text-primary p-1 me-2" onClick={() => navigate(`/vacation/edit/${v.id}`)}>
                                                            <Edit3 size={18} />
                                                        </Button>
                                                        <Button variant="link" className="text-danger p-1" onClick={() => handleDelete(v.id)}>
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <AlertCircle size={48} className="mb-3 opacity-25" />
                                            <p>У вас пока нет созданных заявок</p>
                                        </div>
                                    )}
                                </Card>
                            </Card.Body>
                        </Card>
                    </Col>


                    <Col lg={8}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
                                <h5 className="fw-bold mb-0 d-flex align-items-center">
                                    <Users className="me-2 text-secondary" size={20} />
                                    График отдела
                                </h5>
                                <Form.Select
                                    className="w-auto shadow-sm"
                                    value={selectedPosition}
                                    onChange={(e) => setSelectedPosition(e.target.value)}
                                    disabled={isCalendarLoading}
                                >
                                    {allPositions.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div className="position-relative bg-white rounded border overflow-hidden" style={{ minHeight: '500px' }}>
                                <div className={`calendar-overlay ${isCalendarLoading ? 'active' : ''}`}>
                                    <Spinner animation="border" variant="primary" />
                                </div>

                                <div className={`p-2 calendar-wrapper ${isCalendarLoading ? 'calendar-blur' : ''}`}>
                                    <FullCalendar
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        locale="ru"
                                        events={displayEvents}
                                        firstDay={1}
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: ''
                                        }}
                                        buttonText={{ today: 'Сегодня' }}
                                        height="auto"
                                        eventDisplay="block"
                                    />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreateVacation;
