import "../styles/ForgotPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (email.trim() === "") {
      setError("Введите Email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Ошибка соединения с сервером");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">✅</div>
          <h1 className="login-title">Пароль отправлен</h1>
          <p className="login-subtitle">Новый пароль был отправлен на почту</p>
          <p className="success-email">{email}</p>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Перейти ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🔑</div>
        <h1 className="login-title">Восстановление пароля</h1>
        <p className="login-subtitle">Введите Email, указанный при регистрации</p>
        <form onSubmit={handleSubmit}>
          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Получить новый пароль"}
          </button>
        </form>
        <button className="back-login" onClick={() => navigate("/login")}>
          ← Назад ко входу
        </button>
      </div>
    </div>
  );
}