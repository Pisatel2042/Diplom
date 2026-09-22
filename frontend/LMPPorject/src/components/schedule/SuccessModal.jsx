import { useEffect, useState } from "react";

export default function SuccessModal() {

    const [show, setShow] = useState(false);

    useEffect(() => {

        setTimeout(() => {

            setShow(true);

        }, 100);

    }, []);

    return (

        <div className="success-overlay">

            <div className={show ? "success-modal active" : "success-modal"}>

                <div className="success-circle">

                    ✓

                </div>

                <h1>

                    Оплата прошла успешно!

                </h1>

                <p>

                    Спасибо за запись на занятия.

                </p>

                <p>

                    Через несколько секунд вы будете

                    перенаправлены в личный кабинет.

                </p>

                <div className="success-loader">

                    <div className="loader-bar"></div>

                </div>

            </div>

        </div>

    );

}