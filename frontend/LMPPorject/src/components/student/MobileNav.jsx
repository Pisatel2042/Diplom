import {
    FiHome,
    FiCalendar,
    FiBookOpen,
    FiTrendingUp,
    FiCreditCard,
    FiUser,
} from "react-icons/fi";

const menu = [

    {
        id: "dashboard",
        icon: <FiHome />,
        label: "Главная",
    },

    {
        id: "schedule",
        icon: <FiCalendar />,
        label: "Уроки",
    },

    {
        id: "homework",
        icon: <FiBookOpen />,
        label: "ДЗ",
    },

    {
        id: "progress",
        icon: <FiTrendingUp />,
        label: "Прогресс",
    },

    {
        id: "payments",
        icon: <FiCreditCard />,
        label: "Оплата",
    },

    {
        id: "profile",
        icon: <FiUser />,
        label: "Профиль",
    },

];

export default function MobileNav({

    active,

    setActive,

}){

    return(

        <div className="student-mobile-nav">

            {

                menu.map((item)=>(

                    <button

                        key={item.id}

                        className={

                            active===item.id

                            ?

                            "student-mobile-btn active"

                            :

                            "student-mobile-btn"

                        }

                        onClick={()=>

                            setActive(item.id)

                        }

                    >

                        <div className="mobile-icon">

                            {item.icon}

                        </div>

                        <span>

                            {item.label}

                        </span>

                    </button>

                ))

            }

        </div>

    );

}