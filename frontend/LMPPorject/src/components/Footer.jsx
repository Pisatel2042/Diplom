import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column">

          <h3>Информация</h3>

          <a href="#about">Обо мне</a>
          <a href="#programs">Программы</a>
          <a href="#reviews">Отзывы</a>
          <a href="#faq">FAQ</a>

        </div>

        <div className="footer-column">

          <h3>Документы</h3>

          <a href="/privacy">
            Политика конфиденциальности
          </a>

          <a href="/agreement">
            Пользовательское соглашение
          </a>

          <a href="/offer">
            Договор оферты
          </a>

        </div>

        <div className="footer-column">

          <h3>Социальные сети</h3>

          <a
            href="https://t.me/@Anna_sshum"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>

          <a
            href="https://vk.com/anna_shum"
            target="_blank"
            rel="noreferrer"
          >
            VK
          </a>

          <a
            href="https://max.ru/Internet_freedom"
            target="_blank"
            rel="noreferrer"
          >
            Max
          </a>

         

        </div>

      </div>

      <div className="footer-bottom">

        © 2025 Репетитор английского языка. Все права защищены.

      </div>

    </footer>
  );
}