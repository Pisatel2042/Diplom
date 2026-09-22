import "../styles/Login.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();
    const captchaRef = useRef(null);
    const googleInit = useRef(false);
    const captchaWidget = useRef(null);
    const captchaReady = useRef(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    useEffect(() => {

        if (GOOGLE_CLIENT_ID && window.google && !googleInit.current) {

            googleInit.current = true;

            window.google.accounts.id.initialize({

                client_id: GOOGLE_CLIENT_ID,

                callback: handleGoogleResponse,

            });

        }

    }, []);

    useEffect(() => {

        if (captchaReady.current) return;
        captchaReady.current = true;

        if (window.grecaptcha && captchaRef.current) {

            captchaWidget.current = window.grecaptcha.render(captchaRef.current, {

                sitekey: RECAPTCHA_SITE_KEY,

            });

            return;

        }

        const script = document.createElement("script");

        script.src =

            "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";

        script.async = true;

        script.defer = true;

        window.onloadCallback = () => {

            if (captchaRef.current && captchaWidget.current === null) {

                captchaWidget.current = window.grecaptcha.render(captchaRef.current, {

                    sitekey: RECAPTCHA_SITE_KEY,

                });

            }

        };

        document.body.appendChild(script);

    }, []);

    async function handleLogin(e) {

        e.preventDefault();

        setError("");

        if (!email || !password) {

            setError("Заполните все поля");

            return;

        }

        const captchaToken = window.grecaptcha?.getResponse();

        if (!captchaToken) {

            setError("Подтвердите, что вы не робот");

            return;

        }

        try {

            const response = await fetch(`${API_URL}/api/auth/login`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    email,

                    password,

                    captcha: captchaToken,

                }),

            });

            const data = await response.json();

            if (!response.ok) {

                setError(data.message);

                return;

            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            navigate("/account");

        } catch {

            setError("Ошибка соединения");

        }

    }

    async function handleGoogleResponse(response) {

        const res = await fetch(`${API_URL}/api/auth/google`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({

                idToken: response.credential,

            }),

        });

        const data = await res.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        navigate("/account");

    }

    function handleGoogleClick() {

        if (window.google) {

            window.google.accounts.id.prompt();

        }

    }

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">

                    A

                </div>

                <h1 className="login-title">

                    Добро пожаловать

                </h1>

                <p className="login-subtitle">

                    Войдите в личный кабинет

                </p>

                <form onSubmit={handleLogin}>

                    <div className="login-group">

                        <label>

                            Email

                        </label>

                        <input

                            type="email"

                            placeholder="example@mail.com"

                            value={email}

                            onChange={(e) =>

                                setEmail(e.target.value)

                            }

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

                            onChange={(e) =>

                                setPassword(e.target.value)

                            }

                        />

                    </div>

                    <div className="login-row">

                        <label>

                            <input type="checkbox" />

                            Запомнить меня

                        </label>

                        <button

                            type="button"

                            className="forgot-btn"

                            onClick={() =>

                                navigate("/forgot-password")

                            }

                        >

                            Забыли пароль?

                        </button>

                    </div>

                    {error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )}

                    <div

                        className="captcha"

                        ref={captchaRef}

                    ></div>

                    <button

                        className="login-btn"

                        type="submit"

                    >

                        Войти

                    </button>

                </form>

                <div className="login-divider">

                    или

                </div>

                <button

                    className="google-btn"

                    onClick={handleGoogleClick}

                >

                    🌐 Войти через Google

                </button>

                <div className="login-register">

                    Нет аккаунта?

                    <a href="/registration">

                        Зарегистрироваться

                    </a>

                </div>

            </div>

        </div>

    );

}