import { useEffect, useState } from "react";

export default function Homework({ selectedStudentId }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openHomework, setOpenHomework] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newHomework, setNewHomework] = useState({
    studentId: "",
    title: "",
    testLink: ""
  });

  const loadHomework = () => {
    fetch(`${API_URL}/api/teacher/homework`)
      .then(res => res.json())
      .then(setHomeworks)
      .catch(console.error);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/teacher/students`)
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
    loadHomework();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      setFilter(selectedStudentId.toString());
    }
  }, [selectedStudentId]);

  const filteredHomework = homeworks.filter(item => {
    if (filter === "all") return true;
    return item.studentId === Number(filter);
  });

  async function createHomework() {
    if (!newHomework.studentId || !newHomework.title) return;
    await fetch(`${API_URL}/api/teacher/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: Number(newHomework.studentId),
        title: newHomework.title,
        testLink: newHomework.testLink
      })
    });
    loadHomework();
    setNewHomework({
      studentId: "",
      title: "",
      testLink: ""
    });
    setShowCreate(false);
    setFilter("all");
  }

  async function saveHomework(hw) {
    await fetch(`${API_URL}/api/teacher/homework/${hw.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grade: Number(hw.grade),
        comment: hw.comment
      })
    });
    loadHomework();
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Домашние задания</h1>
        <div className="page-actions">
          <select
            className="student-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Все ученики</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <button
            className="create-homework-btn"
            onClick={() => setShowCreate(true)}
          >
            + Добавить
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay">
          <div className="create-homework-modal">
            <h2>Новое домашнее задание</h2>
            <select
              value={newHomework.studentId}
              onChange={(e) => setNewHomework({
                ...newHomework,
                studentId: e.target.value
              })}
            >
              <option value="">Выберите ученика</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Название задания"
              value={newHomework.title}
              onChange={(e) => setNewHomework({
                ...newHomework,
                title: e.target.value
              })}
            />
            <input
              type="text"
              placeholder="Ссылка на Google Forms"
              value={newHomework.testLink}
              onChange={(e) => setNewHomework({
                ...newHomework,
                testLink: e.target.value
              })}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="save-btn" onClick={createHomework}>Создать</button>
            </div>
          </div>
        </div>
      )}

      <div className="homework-list">
        {filteredHomework.map((hw) => (
  <div key={hw.id} className="homework-card" onClick={() => setOpenHomework(openHomework === hw.id ? null : hw.id)}>
    <div className="homework-header">
      <div>
        <h3>{hw.title}</h3>
        <p>{hw.student}</p>
      </div>
    </div>
    {openHomework === hw.id && (
      <div className="homework-body" onClick={(e) => e.stopPropagation()}>
        <div className="homework-row">
          <span>🔗 Ссылка на тест</span>
          <a href={hw.testLink} target="_blank" rel="noreferrer">Открыть Google Forms</a>
        </div>
        <div className="homework-row">
          <span>⭐ Оценка</span>
          <select
            value={hw.grade ?? ""}
            onChange={(e) => setHomeworks(
              homeworks.map(item =>
                item.id === hw.id ? { ...item, grade: e.target.value } : item
              )
            )}
          >
            <option value="">Выберите</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="homework-row">
          <span>💬 Комментарий</span>
          <textarea
            rows="4"
            placeholder="Комментарий преподавателя..."
            value={hw.comment ?? ""}
            onChange={(e) => setHomeworks(
              homeworks.map(item =>
                item.id === hw.id ? { ...item, comment: e.target.value } : item
              )
            )}
          />
        </div>
        <div className="homework-buttons">
          <button className="save-btn" onClick={() => saveHomework(hw)}>💾 Сохранить</button>
        </div>
      </div>
    )}
  </div>
))}
</div>
</>);
}