import { useEffect, useState } from "react";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/teacher/dashboard`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Загрузка...</h2>;
  }

  if (!data) {
    return <h2>Ошибка загрузки данных</h2>;
  }

  const stats = [
    { title: "Учеников", value: data.stats.students, icon: "👨‍🎓" },
    { title: "Уроков", value: data.stats.lessons, icon: "📚" },
    { title: "ДЗ", value: data.stats.homework, icon: "📝" },
  ];

  return (
    <>
      <h1 className="page-title">Главная</h1>
      <div className="stats-grid">
        {stats.map((item) => (
          <div key={item.title} className="stat-card">
            <div className="stat-icon">{item.icon}</div>
            <h2>{item.value}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="dashboard-card">
            <h2>📅 Ближайшие занятия</h2>
            {data.lessons.map((lesson) => (
              <div className="lesson-item" key={lesson.id}>
                <div>
                  <strong>{lesson.student}</strong>
                  <p>{lesson.topic}</p>
                  <span>{lesson.time}</span>
                </div>
                <button>Открыть</button>
              </div>
            ))}
          </div>
          <div className="dashboard-card">
            <h2>📝 Домашние задания</h2>
            {data.homework.map((item) => (
              <div key={item.id} className="lesson-item">
                <div>
                  <strong>{item.student}</strong>
                  <p>{item.title}</p>
                </div>
                <button>Проверить</button>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-right">
          <div className="dashboard-card">
            <h2> Последние события</h2>
            <ul className="events-list">

                    {data.notifications.map((item) => (

                        <li key={item.id}>

                            <strong>{item.user}</strong>

                            <br />

                            {item.text}

                        </li>

                    ))}

                </ul>
          </div>
        </div>
      </div>
    </>
  );
}