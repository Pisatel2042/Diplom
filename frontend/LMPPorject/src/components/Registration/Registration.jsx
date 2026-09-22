import "../../styles/Register.css";
import "../../styles/Login.css";

import { useState, useEffect, useRef } from "react";

import { FcGoogle } from "react-icons/fc";

import { useNavigate } from "react-router-dom";

export default function Registration() {

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const RECAPTCHA_SITE_KEY =
        import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const captchaRef = useRef(null);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirm, setConfirm] = useState("");

    const [phone, setPhone] = useState("");

    const [telegram, setTelegram] = useState("");

    const [avatar, setAvatar] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(null);

    const [error, setError] = useState("");
    
      function getPasswordStrength(password) {

        let score = 0;

        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-ZА-Я]/.test(password)) score++;


        if (/\d/.test(password)) score++;

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        return score;

    }
    const strength = getPasswordStrength(password);

    useEffect(() => {

        if (GOOGLE_CLIENT_ID && window.google) {

            window.google.accounts.id.initialize({

                client_id: GOOGLE_CLIENT_ID,

                callback: handleGoogleResponse,

            });

        }

    }, []);


    const widgetId = useRef(null);
   

    useEffect(() => {
    const renderCaptcha = () => {
        if (
            window.grecaptcha &&
            captchaRef.current &&
            widgetId.current === null
        ) {
            widgetId.current = window.grecaptcha.render(
                captchaRef.current,
                {
                    sitekey: RECAPTCHA_SITE_KEY,
                }
            );
        }
    };
    if (window.grecaptcha) {
        renderCaptcha();
        return;
    }
    if (!document.getElementById("recaptcha-script")) {
        const script = document.createElement("script");
        script.id = "recaptcha-script";
        script.src =
            "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
        script.async = true;
        script.defer = true;
        window.onloadCallback = renderCaptcha;
        document.body.appendChild(script);
    }
}, []);

    function handleAvatarChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        setAvatar(file);

        const reader = new FileReader();

        reader.onload = (ev) => {

            setAvatarPreview(ev.target.result);

        };

        reader.readAsDataURL(file);

    }
        async function handleRegister(e) {

        e.preventDefault();

        setError("");

        if (!name || !email || !password || !confirm) {

            setError("Заполните все обязательные поля");

            return;

        }

        if (password !== confirm) {

            setError("Пароли не совпадают");

            return;

        }

        try {

            const captchaToken = window.grecaptcha?.getResponse();

            if (!captchaToken) {

                setError("Подтвердите, что вы не робот");

                return;

            }

            const res = await fetch(

                `${API_URL}/api/auth/register`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                    },

                    body: JSON.stringify({

                        name,

                        email,

                        password,

                        phone,

                        telegram,

                        captcha: captchaToken,

                    }),

                }

            );

            const data = await res.json();

            if (!res.ok) {

                setError(

                    data.message ||

                    "Ошибка регистрации"

                );

                return;

            }

            const userId = data.userId;

            if (avatar) {
                const formData = new FormData();
                formData.append(
                    "userId",
                    userId
                );

                formData.append(
                    "file",
                    avatar
                );

                await fetch(
                    `${API_URL}/api/auth/upload-avatar`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
            }

            navigate(`/verify-code?userId=${userId}`);

        }
        catch {
            setError(
                "Ошибка соединения с сервером"
            );

        }

    }

    async function handleGoogleResponse(response) {

        try {

            const res = await fetch(

                `${API_URL}/api/auth/google`,

                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        idToken:
                            response.credential,
                    }),
                }
            );

            if (!res.ok) {

                setError( "Ошибка регистрации через Google");

                return;

            }

            const data = await res.json();

            localStorage.setItem(

                "token",

                data.token

            );

            navigate("/account");

        }

        catch {

            setError(

                "Ошибка соединения"

            );

        }

    }

    function handleGoogleClick() {

        if (!GOOGLE_CLIENT_ID) {

            alert(

                "Google авторизация не настроена"

            );

            return;

        }

        if (window.google) {

            window.google.accounts.id.prompt();

        }

    }
        return (

        <div className="login-page">

            <div className="login-card register-card">

                <div className="login-logo">

                    A

                </div>

                <h1 className="login-title">

                    Создать аккаунт

                </h1>

                <p className="login-subtitle">

                    Начните обучение уже сегодня

                </p>

                <form onSubmit={handleRegister}>

                    <div className="avatar-upload">

                        <label>

                            <input

                                type="file"

                                accept="image/*"

                                onChange={handleAvatarChange}

                                hidden

                            />

                            <div className="avatar-circle">

                                {avatarPreview ? (

                                    <img

                                        src={avatarPreview}

                                        alt="avatar"

                                    />

                                ) : (

                                    "+"

                                )}

                            </div>

                        </label>

                    </div>

                    <div className="login-group">

                        <label>

                            Имя

                        </label>

                        <input

                            type="text"

                            placeholder="Ваше имя"

                            value={name}

                            onChange={(e)=>setName(e.target.value)}

                        />

                    </div>

                    <div className="login-group">

                        <label>

                            Email

                        </label>

                        <input

                            type="email"

                            placeholder="example@mail.com"

                            value={email}

                            onChange={(e)=>setEmail(e.target.value)}

                        />

                    </div>

                    <div className="login-group">

                        <label>

                            Телефон

                        </label>

                        <input

                            type="text"

                            placeholder="+49 123 456789"

                            value={phone}

                            onChange={(e)=>setPhone(e.target.value)}

                        />

                    </div>

                    <div className="login-group">

                        <label>

                            Telegram

                        </label>

                        <input

                            type="text"

                            placeholder="@username"

                            value={telegram}

                            onChange={(e)=>setTelegram(e.target.value)}

                        />

                    </div>

                    <div className="login-group">

                        <label>

                            Пароль

                        </label>

                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />

                    </div>
                    <div className="password-strength">
                            <div
                                className={`strength-bar strength-${strength}`}
                            ></div>
                    </div>
                                  <p className="strength-text">

                  {
                      strength <= 2
                          ? "Слабый пароль"
                          : strength <= 3
                          ? "Хороший пароль"
                          : "Надежный пароль"
                  }

              </p>

                    <div className="login-group">

                        <label>

                            Повторите пароль

                        </label>

                        <input

                            type="password"

                            placeholder="Повторите пароль"

                            value={confirm}

                            onChange={(e)=>setConfirm(e.target.value)}

                        />

                    </div>

                    {error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )}

                    <div className="captcha-box">

                        <div ref={captchaRef}></div>

                    </div>

                    <button

                        type="submit"

                        className="login-btn"

                    >

                        Зарегистрироваться

                    </button>

                </form>

                <div className="login-divider">

                    <span>

                        или

                    </span>

                </div>

                <button

                    className="google-btn"

                    onClick={handleGoogleClick}

                >

                    <FcGoogle size={24}/>

                    Регистрация через Google

                </button>

                <button

                    className="back-login"

                    onClick={()=>navigate("/login")}

                >

                    Уже есть аккаунт? Войти
                </button>

            </div>

        </div>

    );

}