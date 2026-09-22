
import "./Cta.css";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">

      <div className="cta-container">

        <h2 className="cta-title">
           Готовы заговорить на английском?
        </h2>

        <p className="cta-text">
          Запишитесь на бесплатную консультацию и получите
          индивидуальный план обучения уже сегодня.
        </p>

        <button
          className="cta-button"
          onClick={() => navigate("/registration")}
        >
          Начать обучение бесплатно
        </button>

      </div>

    </section>
  );
}

