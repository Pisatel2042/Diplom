import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyCode() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!userId) navigate("/registration");
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Введите полный код");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Неверный код");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      await fetch(`${API_URL}/api/test/attach-to-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: localStorage.getItem("testSessionId"),
          userId: data.userId,
        }),
      });

      navigate("/schedule");
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });
      if (res.ok) {
        setTimer(60);
        setCode(["", "", "", "", "", ""]);
        document.getElementById("code-0")?.focus();
      } else {
        const data = await res.json();
        setError(data.message || "Ошибка");
      }
    } catch {
      setError("Ошибка соединения");
    }
    setResending(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4 overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#ffd1d1]/40 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#d1e4ff]/40 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#ee5a24] flex items-center justify-center text-3xl text-white shadow-lg shadow-[#ee5a24]/25">
            ✉
          </div>

          <h2 className="text-2xl font-bold text-[#2d2d3a] mb-2">
            Подтвердите email
          </h2>
          <p className="text-sm text-[#8a8a9a] mb-8">
            Мы отправили 6-значный код на вашу почту
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-8">
              {code.map((digit, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white border-2 border-[#e2e4e9] text-[#2d2d3a] focus:border-[#ff6b6b] outline-none transition shadow-sm"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white text-lg font-semibold shadow-lg shadow-[#ee5a24]/25 transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Подтвердить"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="mt-6 text-sm text-[#8a8a9a] hover:text-[#ff6b6b] transition disabled:opacity-50"
          >
            {timer > 0
              ? `Отправить повторно через ${timer}с`
              : resending
              ? "Отправка..."
              : "Отправить код повторно"}
          </button>
        </div>
      </div>
    </div>
  );
}
