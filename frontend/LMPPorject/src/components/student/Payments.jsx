import { useEffect, useState } from "react";

export default function Payments() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [payments, setPayments] = useState([]);

    const [selected, setSelected] = useState(null);

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/payments/${userId}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setPayments(data);

                }

                else {

                    setPayments([]);

                }

            })

            .catch(() => {

                setPayments([]);

            });

    }, [userId]);

    return(

        <>

            <h1 className="page-title">

                История оплат

            </h1>

            <div className="payments-list">

                {

                    payments.map((payment)=>(

                        <div

                            key={payment.id}

                            className="payment-card"

                            onClick={()=>

                                setSelected(payment)

                            }

                        >

                            <div>

                                <h3>

                                    {payment.date}

                                </h3>

                                <p>

                                    {payment.lessons} занятие(й)

                                </p>

                            </div>

                            <div>

                                <strong>

                                    {payment.amount} ₽

                                </strong>

                                <div className={

                                    payment.status==="Оплачено"

                                    ?

                                    "status-paid"

                                    :

                                    "status-wait"

                                }>

                                    {payment.status}

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

            {

                selected &&

                <div

                    className="modal-overlay"

                    onClick={()=>setSelected(null)}

                >

                    <div

                        className="payment-modal"

                        onClick={(e)=>e.stopPropagation()}

                    >

                        <div className="payment-modal-icon">

                            💳

                        </div>

                        <h2>

                            Информация о платеже

                        </h2>

                        <div className="payment-info">

                            <div>

                                <span>

                                    📅 Дата

                                </span>

                                <strong>

                                    {selected.date}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    📚 Количество занятий

                                </span>

                                <strong>

                                    {selected.lessons}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    💰 Стоимость

                                </span>

                                <strong>

                                    {selected.amount} ₽

                                </strong>

                            </div>

                            <div>

                                <span>

                                    📌 Статус

                                </span>

                                <strong>

                                    {selected.status}

                                </strong>

                            </div>

                        </div>

                        {

                            selected.status==="Ожидает оплаты"

                            ?

                            <button className="pay-btn">

                                💳 Оплатить

                            </button>

                            :

                            <button className="download-btn">

                                📄 Скачать чек

                            </button>

                        }

                        <button

                            className="close-btn"

                            onClick={()=>setSelected(null)}

                        >

                            Закрыть

                        </button>

                    </div>

                </div>

            }

        </>

    );

}