import { useState, useEffect } from "react";

export default function Profile() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [user, setUser] = useState({

        avatar: "",

        name: "",

        email: "",

        phone: "",

        telegram: "",

        level: "",

        lessons: 0

    });

    useEffect(() => {

        if (!userId) return;

        fetch(`${API_URL}/api/student/profile/${userId}`)

            .then(res => res.json())

            .then(data => {

                setUser({

                    avatar: data.avatar,

                    name: data.name,

                    email: data.email,

                    phone: data.phone,

                    telegram: data.telegram,

                    level: data.level,

                    lessons: data.lessons

                });

            });

    }, [userId]);

    async function changeAvatar(e) {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("userId", userId);

        formData.append("file", file);

        const res = await fetch(

            `${API_URL}/api/auth/upload-avatar`,

            {

                method: "POST",

                body: formData

            }

        );

        const data = await res.json();

        setUser({

            ...user,

            avatar: data.avatarUrl

        });

    }

    async function save() {

        await fetch(

            `${API_URL}/api/student/profile/${userId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name: user.name,

                    phone: user.phone,

                    telegram: user.telegram

                })

            }

        );

        alert("Данные успешно сохранены!");

    }

    return(

        <>

            <h1 className="page-title">

                Мой профиль

            </h1>

            <div className="profile-card">

                <div className="profile-avatar-section">

                    <label>

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

                                className="profile-avatar"

                            />

                            :

                            <div className="profile-avatar">

                                {user.name?.[0]}

                            </div>

                        }

                        <input

                            type="file"

                            hidden

                            accept="image/*"

                            onChange={changeAvatar}

                        />

                    </label>

                    <h2>

                        {user.name}

                    </h2>

                    <p>

                        Уровень {user.level}

                    </p>

                </div>

                <div className="profile-form">

                    <div className="profile-group">

                        <label>

                            Имя

                        </label>

                        <input

                            value={user.name}

                            onChange={(e)=>

                                setUser({

                                    ...user,

                                    name:e.target.value

                                })

                            }

                        />

                    </div>

                    <div className="profile-group">

                        <label>

                            Email

                        </label>

                        <input

                            value={user.email}

                            disabled

                        />

                    </div>

                    <div className="profile-group">

                        <label>

                            Телефон

                        </label>

                        <input

                            value={user.phone}

                            onChange={(e)=>

                                setUser({

                                    ...user,

                                    phone:e.target.value

                                })

                            }

                        />

                    </div>
                                        <div className="profile-group">

                        <label>

                            Telegram

                        </label>

                        <input

                            value={user.telegram}

                            onChange={(e)=>

                                setUser({

                                    ...user,

                                    telegram:e.target.value

                                })

                            }

                        />

                    </div>

                    <div className="profile-info-grid">

                        <div>

                            <span>

                                📚 Пройдено уроков

                            </span>

                            <strong>

                                {user.lessons}

                            </strong>

                        </div>

                        <div>

                            <span>

                                🎓 Уровень

                            </span>

                            <strong>

                                {user.level}

                            </strong>

                        </div>

                    </div>

                    <button

                        className="save-profile-btn"

                        onClick={save}

                    >

                        💾 Сохранить изменения

                    </button>

                </div>

            </div>

        </>

    );

}