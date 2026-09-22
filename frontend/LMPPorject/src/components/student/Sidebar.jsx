import {
    FiHome,
    FiCalendar,
    FiBookOpen,
    FiClock,
    FiCreditCard,
    FiBell,
    FiUser,
    FiLogOut,
} from "react-icons/fi";

import { useEffect, useState } from "react";

const menu = [

    {
        id: "dashboard",
        title: "Главная",
        icon: <FiHome />,
    },

    {
        id: "schedule",
        title: "Расписание",
        icon: <FiCalendar />,
    },

    {
        id: "homework",
        title: "Домашние задания",
        icon: <FiBookOpen />,
    },

    {
        id: "history",
        title: "История",
        icon: <FiClock />,
    },

    {
        id: "payments",
        title: "Оплата",
        icon: <FiCreditCard />,
    },

    {
        id: "notifications",
        title: "Уведомления",
        icon: <FiBell />,
    },

    {
        id: "profile",
        title: "Профиль",
        icon: <FiUser />,
    },

];

export default function Sidebar({

    active,

    setActive,

}) {

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    let userId = localStorage.getItem("userId");
    if (!userId && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
        if (userId) localStorage.setItem("userId", userId);
      } catch {}
    }

    const [user, setUser] = useState({

        name: "",

        avatar: "",

        level: ""

    });

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/profile/${userId}`)

            .then(res => res.json())

            .then(data => {

                setUser({

                    name: data.name,

                    avatar: data.avatar,

                    level: data.level

                });

            })

            .catch(() => { });

    }, [userId]);

    function logout() {

        localStorage.removeItem("token");

        localStorage.removeItem("userId");

        window.location.href = "/login";

    }

    return (

        <aside className="student-sidebar">

            <div className="student-logo">

                <div className="student-logo-icon">

                    🎓

                </div>

                <div>

                    <h2>

                        English.Pro

                    </h2>

                    <span>

                        Кабинет ученика

                    </span>

                </div>

            </div>

            <nav className="student-nav">

                {

                    menu.map((item) => (

                        <button

                            key={item.id}

                            className={

                                active === item.id

                                    ?

                                    "student-link active"

                                    :

                                    "student-link"

                            }

                            onClick={() => setActive(item.id)}

                        >

                            <span className="student-link-icon">

                                {item.icon}

                            </span>

                            <span>

                                {item.title}

                            </span>

                        </button>

                    ))

                }

            </nav>

            <div className="student-sidebar-footer">

                <div className="student-user">

                    {

                        user.avatar

                        ?

                        <img

                            src={

                                user.avatar.startsWith("http")

                                ?

                                user.avatar

                                :

                                API_URL + user.avatar

                            }

                            className="student-avatar"

                        />

                        :

                        <div className="student-avatar">

                            {

                                user.name

                                ?

                                user.name[0].toUpperCase()

                                :

                                "?"

                            }

                        </div>

                    }

                    <div>

                        <strong>

                            {user.name}

                        </strong>

                        <p>

                            Уровень {user.level}

                        </p>

                    </div>

                </div>

                <button

                    className="logout-btn"

                    onClick={logout}

                >

                    <FiLogOut />

                    <span>

                        Выйти

                    </span>

                </button>

            </div>

        </aside>

    );

}