import { useEffect, useState } from "react";

export default function Schedule() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [lessons, setLessons] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    fetch(`${API_URL}/api/teacher/schedule`)
      .then(res => res.json())
      .then(setLessons)
      .catch(console.error);
  }, []);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const selectedLessons = lessons.filter(lesson => lesson.day === selectedDay);

  return (
    <>
      <h1 className="page-title">Расписание</h1>
      <div className="schedule-container">
        <div className="calendar-card">
          <h2>Июнь</h2>
          <div className="calendar-grid">
            {days.map((day) => {
              const hasLesson = lessons.some(lesson => lesson.day === day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    calendar-day
                    ${hasLesson ? "busy-day" : ""}
                    ${selectedDay === day ? "active-day" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        <div className="day-lessons">
          <h2>{selectedDay} июня</h2>
          {selectedLessons.length === 0 && (
            <div className="empty-day">На этот день занятий нет</div>
          )}
          {selectedLessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <h3>👤 {lesson.student}</h3>
              <p>🕒 {lesson.time}</p>
              <p>📚 {lesson.topic}</p>
              <button>Открыть</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}