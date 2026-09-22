import { useState, useEffect } from "react";

export default function MiniTestPage({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/test/questions`)
      .then(res => res.json())
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("testSessionId")) {
      localStorage.setItem("testSessionId", crypto.randomUUID());
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-[#6b6b80] text-lg">Загрузка...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-[#2d2d3a] mb-2">Нет вопросов</h2>
          <p className="text-[#6b6b80] mb-6">Попробуйте позже</p>
          <button onClick={() => onFinish && onFinish({})} className="clay-btn px-8 py-3 text-white font-bold">
            Пропустить
          </button>
        </div>
      </div>
    );
  }

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleSelect = async (option) => {
    setAnswers({ ...answers, [current.id]: option });
    await fetch(`${API_URL}/api/test/save-temp-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: localStorage.getItem("testSessionId"),
        questionId: current.id,
        answer: option
      })
    });
  };

  const next = () => {
    if (!answers[current.id]) return;
    if (step < questions.length - 1) setStep(step + 1);
    else finishTest();
  };

  const finishTest = () => {
    localStorage.setItem("miniTestAnswers", JSON.stringify(answers));
    if (onFinish) onFinish(answers);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8">
          <div className="w-full h-2 bg-[#e2e4e9] rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="text-xl font-bold text-[#2d2d3a] mb-6">{current.questionText}</h2>

          <div className="flex flex-col gap-3">
            {current.options.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                  answers[current.id] === opt
                    ? "border-[#ff6b6b] bg-[#ff6b6b]/10 text-[#2d2d3a]"
                    : "border-[#e2e4e9] bg-white text-[#6b6b80] hover:border-[#ccc]"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${current.id}`}
                  value={opt}
                  checked={answers[current.id] === opt}
                  onChange={() => handleSelect(opt)}
                  className="w-4 h-4 accent-[#ff6b6b]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <button
            onClick={next}
            disabled={!answers[current.id]}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white font-bold shadow-lg shadow-[#ee5a24]/25 transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === questions.length - 1 ? "Завершить" : "Продолжить"}
          </button>
        </div>
      </div>
    </div>
  );
}
