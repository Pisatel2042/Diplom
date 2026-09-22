import {
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineBookOpen,
    HiOutlineBell,
    HiOutlineVideoCamera
} from "react-icons/hi2";

export const navItems=[

    {
        id:"dashboard",
        label:"Главное",
          icon: HiOutlineHome

    },

    {
        id:"students",
        label:"Ученики",
         icon: HiOutlineUsers
    },

    {
        id:"schedule",
        label:"Расписание",
          icon: HiOutlineCalendar
    },

    {
        id:"homework",
        label:"Домашние",
        icon: HiOutlineBookOpen
    },

    {
        id:"history",
        label:"Уроки",
        icon: HiOutlineBell
    },

    {
        id:"notify",
        label:"Уведомления",
        icon:HiOutlineVideoCamera
    }

]