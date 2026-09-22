import { useEffect, useState } from "react";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");

    // если userId нет — пробуем достать из JWT
    if (!userId && token) {
      try {
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));

        userId =
          payload.id ||
          payload.userId ||
          payload.nameid ||
          payload.sub ||
          null;

        if (userId) {
          localStorage.setItem("userId", userId);
        }
      } catch (e) {
        console.error("JWT decode error:", e);
      }
    }

    // если вообще нет userId → редирект/ошибка
    if (!userId) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/student/dashboard/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed request");
        }
        return await res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>
        Загрузка...
      </h2>
    );
  }

  if (error) {
    return (
      <h2
        className="page-title"
        style={{ color: "#8a8a9a", textAlign: "center", marginTop: 60 }}
      >
        Ошибка загрузки данных
      </h2>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            Добро пожаловать, {data?.name} 👋
          </h1>
          <p>Сегодня отличный день, чтобы стать лучше!</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card next-lesson">
          <div className="card-icon">📅</div>
          <h3>Следующий урок</h3>
          <h2>{data?.nextLesson?.date || "Нет занятий"}</h2>
          <p>{data?.nextLesson?.time || ""}</p>
          <button>Подключиться</button>
        </div>

        <div className="dashboard-card homework-card">
          <div className="card-icon">📚</div>
          <h3>Домашнее задание</h3>
          <h2>{data?.homework?.title || "Нет заданий"}</h2>
          <p>Статус: {data?.homework?.status || "-"}</p>
          <button>Открыть</button>
        </div>
      </div>

      <div className="progress-card">
        <h2>📈 Ваш прогресс</h2>

        <div className="progress-box">
          <span>Уровень</span>
          <strong>{data?.level}</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width:
                data?.level === "A1"
                  ? "20%"
                  : data?.level === "A2"
                  ? "40%"
                  : data?.level === "B1"
                  ? "60%"
                  : data?.level === "B2"
                  ? "80%"
                  : "100%",
            }}
          />
        </div>

        <p>Продолжайте заниматься каждый день!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{data?.lessonsCount || 0}</h2>
          <span>Проведено уроков</span>
        </div>

        <div className="stat-card">
          <h2>{data?.homeworkCount || 0}</h2>
          <span>Домашних выполнено</span>
        </div>

        <div className="stat-card">
          <h2>{data?.average || 0}</h2>
          <span>Средний балл</span>
        </div>

        <div className="stat-card">
          <h2>{data?.days || 0}</h2>
          <span>Дней подряд занимаетесь</span>
        </div>
      </div>

      <div className="achievements-card">
        <h2>🏆 Достижения</h2>

        <div className="achievement-grid">
          <div className="achievement">
            ⭐ <span>Первые 10 уроков</span>
          </div>

          <div className="achievement">
            📚 <span>Выполнено {data?.homeworkCount || 0} ДЗ</span>
          </div>

          <div className="achievement">
            🔥 <span>Серия {data?.days || 0} дней</span>
          </div>

          <div className="achievement">
            🎓 <span>Уровень {data?.level}</span>
          </div>
        </div>
      </div>
    </>
  );
}