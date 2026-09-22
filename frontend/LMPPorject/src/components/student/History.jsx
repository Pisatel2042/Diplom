import { useEffect, useState } from "react";

export default function History() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [history, setHistory] = useState([]);

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/history/${userId}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setHistory(data);

                }

                else {

                    setHistory([]);

                }

            })

            .catch(() => {

                setHistory([]);

            });

    }, [userId]);

    return (

        <>

            <h1 className="page-title">

                История обучения

            </h1>

            <div className="history-list">

                {

                    history.map((lesson) => (

                        <div

                            key={lesson.id}

                            className="history-card"

                        >

                            <div className="history-left">

                                <div className="history-date">

                                    📅 {lesson.date}

                                </div>

                                <h3>

                                    {lesson.topic}

                                </h3>

                                <p>

                                    ⏱ {lesson.duration}

                                </p>

                            </div>

                            <div className="history-right">

                                <div className="history-homework">

                                    📚 {lesson.homework}

                                </div>

                                <div className="history-grade">

                                    ⭐ {lesson.mark}

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </>

    );

}