import photoTeacher from "../assets/Photo/PhotoTeacher.jpg";
import "../components/About.css"


export default function About() {
  return (
  
<section className="about-section">

  <div className="about-container">

    <div className="about-header">
      <span className="about-badge">
          Обо мне
      </span>
    </div>

    <div className="about-content">

      <div className="about-photo">
        <img
          src={photoTeacher}
          alt="Преподаватель"
        />
      </div>

      <div className="about-info">

        <h2 className="accent">
          Помогаю студентам говорить естественно
        </h2>

        <p className="about-subtitle">
          Преподаватель английского • Индивидуальные уроки • Онлайн-формат
        </p>

        <p className="about-text">
          Я помогаю людям улучшить свой английский с помощью
          индивидуальных уроков, ориентированных на реальное общение.
        </p>

        <p className="about-text">
          На уроках — разговорная практика, современные материалы
          и программа под ваши цели.
        </p>

        <div className="about-social">

          

          <span className="text-sm text-[#8a8a9a] font-medium">Соцсети:</span>
              <a href="https://t.me/@Anna_sshum" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0088cc]/10 text-[#0088cc] transition hover:bg-[#0088cc]/20 hover:-translate-y-0.5" title="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="https://wa.me/79123456789" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077ff]/10 text-[#25D366] transition hover:bg-[#25D366]/20 hover:-translate-y-0.5" title="Max">
                 <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="white" font-family="Arial, sans-serif">Мax</text>
              </a>
              <a href="https://vk.com/anna_shum" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077ff]/10 text-[#0077ff] transition hover:bg-[#0077ff]/20 hover:-translate-y-0.5" title="VK">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.684 0H8.316C2.755 0 0 2.755 0 8.316v7.368C0 21.245 2.755 24 8.316 24h7.368C21.245 24 24 21.245 24 15.684V8.316C24 2.755 21.245 0 15.684 0zm3.262 17.62h-1.459c-.688 0-.852-.467-1.898-1.512-.96-.937-1.387-1.076-1.624-1.076-.33 0-.426.096-.426.553v1.204c0 .358-.116.563-1.042.563-1.53 0-3.23-.938-4.425-2.685C5.414 10.854 5.43 8.7 5.43 8.222c0-.194.086-.292.284-.292h1.46c.296 0 .415.134.533.562.576 1.855 1.544 3.564 1.94 3.564.148 0 .218-.07.218-.55v-2.23c-.048-1.023-.63-1.107-.63-1.475 0-.164.127-.292.295-.292h2.53c.236 0 .317.127.317.422v2.498c0 .236.1.317.174.317.141 0 .258-.081.412-.235.947-1.03 1.645-2.62 1.645-2.62.085-.17.184-.254.344-.254h1.46c.247 0 .38.127.317.382-.19.96-1.545 3.025-1.545 3.025-.138.19-.153.296 0 .498.106.148.764.704 1.16 1.126.633.68 1.122 1.26 1.252 1.66.147.382-.08.563-.327.563z"/></svg>
              </a>


        </div>

      </div>

    </div>

  </div>

</section>


  );
}
