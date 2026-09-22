const PRICE_PER_LESSON = 1500;

export default function SummaryCard({

    lessons,

    total,

    removeLesson,

    openPayment

}){

    return(

        <div className="summary-card">

            <div className="summary-header">

                <h2>

                    Ваши занятия

                </h2>

                <p>

                    Выбранные даты и время

                </p>

            </div>

            {

                lessons.length===0 &&

                <div className="summary-empty">

                    <div className="summary-icon">

                        📅

                    </div>

                    <p>

                        Пока ничего не выбрано

                    </p>

                    <span>

                        Выберите день и время занятия

                    </span>

                </div>

            }

            {

                lessons.length>0 &&

                <div className="summary-list">

                    {

                        lessons.map((lesson,index)=>(

                            <div

                                className="summary-item"

                                key={index}

                            >

                                <div>

                                    <h4>

                                        {

                                            lesson.date.toLocaleDateString(

                                                "ru-RU",

                                                {

                                                    day:"numeric",

                                                    month:"long"

                                                }

                                            )

                                        }

                                    </h4>

                                    <p>

                                        🕒 {lesson.time}

                                    </p>

                                </div>

                                <button

                                    className="remove-btn"

                                    onClick={()=>removeLesson(index)}

                                >

                                    ✕

                                </button>

                            </div>

                        ))

                    }

                </div>

            }

            <div className="summary-total">

                <div className="summary-row">

                    <span>

                        Количество занятий

                    </span>

                    <strong>

                        {lessons.length}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>

                        Цена за занятие

                    </span>

                    <strong>

                        {PRICE_PER_LESSON} ₽

                    </strong>

                </div>

                <div className="summary-price">

                    <span>

                        Итого

                    </span>

                    <h1>

                        {total.toLocaleString()} ₽

                    </h1>

                </div>

            </div>

            <button

                className="payment-btn"

                disabled={lessons.length===0}

                onClick={openPayment}

            >

                💳 Перейти к оплате

            </button>

        </div>

    );

}