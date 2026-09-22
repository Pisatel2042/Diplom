import { useState, useEffect } from "react";

export default function Homework() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [homeworks, setHomeworks] = useState([]);

    const [open, setOpen] = useState(null);

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/homework/${userId}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setHomeworks(data);

                }

                else {

                    setHomeworks([]);

                }

            })

            .catch(() => {

                setHomeworks([]);

            });

    }, [userId]);

    return (

        <>

            <h1 className="page-title">

                Домашние задания

            </h1>

            <div className="student-homework-list">

                {

                    homeworks.map((hw) => (

                        <div

                            className="student-homework-card"

                            key={hw.id}

                        >

                            <div

                                className="student-homework-header"

                                onClick={() =>

                                    setOpen(

                                        open === hw.id

                                            ?

                                            null

                                            :

                                            hw.id

                                    )

                                }

                            >

                                <div>

                                    <h3>

                                        {hw.title}

                                    </h3>

                                    <p>

                                        {hw.status}

                                    </p>

                                </div>

                                <span>

                                    {

                                        open === hw.id

                                            ?

                                            "▲"

                                            :

                                            "▼"

                                    }

                                </span>

                            </div>

                            {

                                open === hw.id &&

                                <div className="student-homework-body">

                                    <div className="student-row">

                                        <span>

                                            🔗 Тест

                                        </span>

                                        <a

                                            href={hw.testLink}

                                            target="_blank"

                                            rel="noreferrer"

                                        >

                                            Открыть Google Forms

                                        </a>

                                    </div>

                                    <div className="student-row">

                                        <span>

                                            ⭐ Оценка

                                        </span>

                                        <strong>

                                            {

                                                hw.grade

                                                    ?

                                                    hw.grade

                                                    :

                                                    "Не проверено"

                                            }

                                        </strong>

                                    </div>

                                    <div className="student-row">

                                        <span>

                                            💬 Комментарий

                                        </span>

                                        <p>

                                            {

                                                hw.comment

                                                    ?

                                                    hw.comment

                                                    :

                                                    "Комментарий пока отсутствует"

                                            }

                                        </p>

                                    </div>

                                </div>

                            }

                        </div>

                    ))

                }

            </div>

        </>

    );

}