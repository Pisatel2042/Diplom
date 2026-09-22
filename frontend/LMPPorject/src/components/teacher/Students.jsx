import { useEffect, useState } from "react";

export default function Students({ setSelectedStudentId, setActiveTab }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/teacher/students`)
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  return (
    <>
      <h1 className="page-title">Ученики</h1>
      <div className="student-grid">
        {students.map((student) => (
          <div className="student-card" key={student.id}>
            <div className="student-avatar">
              {student.avatar ? (
                <img src={API_URL + student.avatar} alt={student.name} />
              ) : (
                student.name?.[0]
              )}
            </div>
            <h3>{student.name}</h3>
            <p>{student.level}</p>
            <button className="open-btn" onClick={() => setSelectedStudent(student)}>
              Открыть
            </button>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="student-modal-avatar">
              {selectedStudent.avatar ? (
                <img src={API_URL + selectedStudent.avatar} alt={selectedStudent.name} />
              ) : (
                selectedStudent.name?.[0]
              )}
            </div>
            <h2>{selectedStudent.name}</h2>
            <div className="student-info">
              <div>
                <span>📚 Уровень</span>
                <strong>{selectedStudent.level}</strong>
              </div>
              <div>
                <span>🎯 Проведено уроков</span>
                <strong>{selectedStudent.lessons}</strong>
              </div>
              <div>
                <span>📅 Следующий урок</span>
                <strong>{selectedStudent.next || "Не назначен"}</strong>
              </div>
              <div>
                <span>📞 Телефон</span>
                <strong>{selectedStudent.phone}</strong>
              </div>
              <div>
                <span>✉ Email</span>
                <strong>{selectedStudent.email}</strong>
              </div>
              <div>
                <span>Telegram</span>
                <strong>{selectedStudent.telegram || "-"}</strong>
              </div>
            </div>
            <div className="student-actions">
              <button className="green-btn">Написать</button>
              <button
                className="homework-btn"
                onClick={() => {
                  if (setSelectedStudentId) {
                    setSelectedStudentId(selectedStudent.id);
                  }
                  setSelectedStudent(null);
                  if (setActiveTab) {
                    setActiveTab("homework");
                  }
                }}
              >
                📚 Домашние задания
              </button>
            </div>
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}