import { useEffect, useRef, useState } from "react";

export default function Captcha({ onValidate }) {
  const canvasRef = useRef(null);
  const [code, setCode] = useState("");

  const generateCode = () =>
    Math.random().toString(36).substring(2, 7).toUpperCase();

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 200, 60);
    ctx.fillStyle = "#f3f3f3";
    ctx.fillRect(0, 0, 200, 60);

    ctx.font = "32px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(text, 40, 40);

    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 200, Math.random() * 60, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const refresh = () => {
    const newCode = generateCode();
    setCode(newCode);
    drawCaptcha(newCode);

    // ВАЖНО: передаём новый код
    onValidate("", newCode);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded-xl border border-[#e2e4e9] bg-white shadow-sm"
      />

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Введите код"
          onChange={(e) => onValidate(e.target.value.toUpperCase(), code)}
          className="flex-1 rounded-xl border border-[#e2e4e9] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={refresh}
          className="px-3 rounded-xl bg-[#ff6b6b] text-white text-sm"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
