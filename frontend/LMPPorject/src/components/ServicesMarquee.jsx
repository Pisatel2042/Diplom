
import "./ServicesMarquee.css";

export default function ServicesMarquee() {
  return (
    <section className="consultation">

      <div className="consultation-border">

        <div className="consultation-card">

          <h2>Бесплатная консультация</h2>

          <p className="subtitle">
            Длительность: 15–20 минут
          </p>

          <form>

            <input type="text" placeholder="Имя" />

            <input type="tel" placeholder="Телефон" />

            <input type="text" placeholder="Телеграм" />

            <button type="submit">
              Отправить
            </button>

          </form>

          <p className="privacy">
            Нажимая кнопку «Отправить», вы соглашаетесь
            с политикой конфиденциальности.
          </p>

        </div>

      </div>

    </section>
  );
}

