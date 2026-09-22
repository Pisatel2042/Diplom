
import "./Programs.css";
import {
  FiGlobe,
  FiBriefcase,
  FiMonitor,
  FiTarget,
  FiMessageCircle,
  FiSmile,
} from "react-icons/fi";

const programs = [
  {
    icon: <FiGlobe />,
    title: "Общий английский",
    text: "Индивидуальная программа для развития разговорных навыков, уверенности и беглости речи.",
  },
  {
    icon: <FiBriefcase />,
    title: "Бизнес-английский",
    text: "Деловая переписка, встречи, презентации и профессиональная коммуникация.",
  },
  {
    icon: <FiMonitor />,
    title: "Английский для IT",
    text: "Терминология, митинги, документация, общение с командой и заказчиками.",
  },
  {
    icon: <FiTarget />,
    title: "Подготовка к IELTS",
    text: "Стратегии, практика всех секций и повышение балла.",
  },
  {
    icon: <FiMessageCircle />,
    title: "Разговорный клуб",
    text: "Живое общение в группе и снятие языкового барьера.",
  },
  {
    icon: <FiSmile />,
    title: "Английский для детей",
    text: "Увлекательные занятия с играми и интерактивными заданиями.",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="programs-section">

      <div className="programs-header">
       

        <h2>
          Выбери свой курс
        </h2>
      </div>

      <div className="programs-grid">

        {programs.map((p, i) => (
          <div key={i} className="program-card">

            <span className="program-icon">
              {p.icon}
            </span>

            <h3>
              {p.title}
            </h3>

            <p>
              {p.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

