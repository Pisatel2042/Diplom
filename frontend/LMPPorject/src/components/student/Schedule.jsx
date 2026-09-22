import { useState, useEffect } from "react";

export default function Schedule() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [lessons, setLessons] = useState([]);

    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {

        if (!userId) {

            return;

        }

        fetch(`${API_URL}/api/student/schedule/${userId}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setLessons(data);

                }

                else {

                    setLessons([]);

                }

            })

            .catch(() => {

                setLessons([]);

            });

    }, [userId]);

    return (

        <>

            <h1 className="page-title">

                Мои занятия

            </h1>

            <div className="lesson-list">

                {

                    lessons.map((lesson) => (

                        <div

                            key={lesson.id}

                            className="lesson-card"

                            onClick={() =>

                                setSelectedLesson(lesson)

                            }

                        >

                            <div className="lesson-date">

                                📅 {lesson.date}

                            </div>

                            <div className="lesson-time">

                                🕒 {lesson.time}

                            </div>

                            <div className="lesson-status">

                                Предстоит

                            </div>

                        </div>

                    ))

                }

            </div>

            {

                selectedLesson &&

                <div

                    className="modal-overlay"

                    onClick={() =>

                        setSelectedLesson(null)

                    }

                >

                    <div

                        className="lesson-modal"

                        onClick={(e) => e.stopPropagation()}

                    >

                        <div className="lesson-modal-icon">

                            📚

                        </div>

                        <h2>

                            Информация о занятии

                        </h2>

                        <div className="lesson-info">

                            <div>

                                <span>

                                    📅 Дата

                                </span>

                                <strong>

                                    {selectedLesson.date}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    🕒 Время

                                </span>

                                <strong>

                                    {selectedLesson.time}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    👩‍🏫 Преподаватель

                                </span>

                                <strong>

                                    {selectedLesson.teacher}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    📖 Тема

                                </span>

                                <strong>

                                    {selectedLesson.topic}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    📌 Статус

                                </span>

                                <strong>

                                    Предстоит

                                </strong>

                            </div>

                        </div>

                        <div className="lesson-buttons">

                            <button className="join-btn">

                                🎥 Подключиться

                            </button>

                            <button

                                className="close-btn"

                                onClick={() =>

                                    setSelectedLesson(null)

                                }

                            >

                                Закрыть

                            </button>

                        </div>

                    </div>

                </div>

            }

        </>

    );

}