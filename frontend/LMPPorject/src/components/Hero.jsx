import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-container">

        

        <h1 className="hero-title">
          Английский легко
          <br />
          <span>и с удовольствием</span>
        </h1>

        <p className="hero-text">
          Помогаю детям и взрослым заговорить
          на английском уверенно и без страха.
        </p>

        <div className="hero-features">

          <div className="hero-feature">
            Разговорная практика
          </div>

          <div className="hero-feature">
             Индивидуальный план
          </div>

          <div className="hero-feature">
             Современные методики
          </div>

          <div className="hero-feature">
             Любой уровень
          </div>

        </div>

        <div className="hero-buttons">
         
          <button className="hero-btn-primary"
                  onClick={() =>
                      document
                          .getElementById("schedule")
                          ?.scrollIntoView({
                              behavior: "smooth",
                          })
                  }
              >

                  Бесплатная консультация

              </button>

          <button className="hero-btn-secondary" 
                  onClick={() =>
                      document
                          .getElementById("programs")
                          ?.scrollIntoView({
                              behavior: "smooth",
                          })
                  }>
            Смотреть программы
          </button>

        </div>

      </div>

    </section>
  );
}

