import { useState, useEffect } from "react";

export default function Notifications() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/notifications/${userId}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setNotifications(data);

                }

                else {

                    setNotifications([]);

                }

            })

            .catch(() => {

                setNotifications([]);

            });

    }, [userId]);

    async function markAsRead(id) {

        await fetch(`${API_URL}/api/student/notifications/read/${id}`, {

            method: "PUT"

        });

        setNotifications(

            notifications.map(item =>

                item.id === id

                    ?

                    {

                        ...item,

                        read: true

                    }

                    :

                    item

            )

        );

    }

    async function readAll() {

        await fetch(`${API_URL}/api/student/notifications/read-all/${userId}`, {

            method: "PUT"

        });

        setNotifications(

            notifications.map(item => (

                {

                    ...item,

                    read: true

                }

            ))

        );

    }

    function icon(type) {

        switch(type) {

            case "lesson":

                return "📅";

            case "homework":

                return "📚";

            case "grade":

                return "⭐";

            case "payment":

                return "💳";

            default:

                return "🔔";

        }

    }

    return(

        <>

            <div className="page-header">

                <h1 className="page-title">

                    Уведомления

                </h1>

                <button

                    className="read-all-btn"

                    onClick={readAll}

                >

                    ✓ Прочитать все

                </button>

            </div>

            <div className="notifications-list">

                {

                    notifications.map((item)=>(

                        <div

                            key={item.id}

                            className={

                                item.read

                                ?

                                "notification-card"

                                :

                                "notification-card unread"

                            }

                            onClick={()=>

                                markAsRead(item.id)

                            }

                        >

                            <div className="notification-icon">

                                {icon(item.type)}

                            </div>

                            <div className="notification-content">

                                <h3>

                                    {item.title}

                                </h3>

                                <p>

                                    {item.text}

                                </p>

                                <span>

                                    {item.date}

                                </span>

                            </div>

                            {

                                !item.read &&

                                <div className="notification-dot"></div>

                            }

                        </div>

                    ))

                }

            </div>

        </>

    );

}