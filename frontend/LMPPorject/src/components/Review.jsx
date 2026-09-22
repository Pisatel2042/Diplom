
import "./Review.css";

const reviews = [
  {
    name: "Екатерина",
    text: "Ольга специалист своего дела! Вместе с ней уверенно идут к цели, чувствую поддержку и заботу, хотя с детства не любила английский язык...",
  },
  {
    name: "Данила",
    text: "Хотелось бы выразить огромную благодарность нашему преподавателю английского языка. Благодаря индивидуальному подходу занятия проходят очень комфортно...",
  },
  {
    name: "Никита",
    text: "Оля говорит с поставленным британским акцентом. Очень интересные уроки и приятная атмосфера.",
  },
];

export default function Review() {
  return (
    <section className="reviews-section">

      <h1 className="reviews-bg-title">
        Отзывы
      </h1>

      <div className="reviews-arrows">
        <button>{"<"}</button>
        <button>{">"}</button>
      </div>

      <div className="reviews-grid">

        {reviews.map((review, index) => (
          <div className="review-card" key={index}>

            <h3>{review.name}</h3>

            <p>{review.text}</p>

           
          </div>
        ))}

      </div>

     

    </section>
  );
}

