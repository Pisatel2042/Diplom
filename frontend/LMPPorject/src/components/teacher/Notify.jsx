import { useEffect, useState } from "react";

export default function Notify() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/teacher/students`)
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  async function sendNotification() {
    if (!userId || !text) {
      alert("Заполните все поля");
      return;
    }
    const response = await fetch(`${API_URL}/api/teacher/notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        text: text,
        type: "Message"
      })
    });
    if (response.ok) {
      alert("Уведомление отправлено");
      setUserId("");
      setText("");
    }
  }

  return (
    <>
      <h1 className="page-title">Уведомления</h1>
      <div className="panel-card notify-card">
        <div className="notify-group">
          <label>Ученик</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Выберите ученика</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="notify-group">
          <label>Сообщение</label>
          <textarea
            rows="8"
            placeholder="Введите сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="notify-footer">
          <button className="save-btn" onClick={sendNotification}>
            📩 Отправить
          </button>
        </div>
      </div>
    </>
  );
}