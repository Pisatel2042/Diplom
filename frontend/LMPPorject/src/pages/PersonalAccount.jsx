import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Sidebar from "../components/student/Sidebar";
import MobileNav from "../components/student/MobileNav";

import Dashboard from "../components/student/Dashboard";
import Schedule from "../components/student/Schedule";
import Homework from "../components/student/Homework";
import History from "../components/student/History";
import Payments from "../components/student/Payments";
import Profile from "../components/student/Profile";
import Notifications from "../components/student/Notifications";

import "../styles/student.css";

export default function PersonalAccount() {

    const [active, setActive] = useState("dashboard");

    return (

        <Box className="student-page">

            <Sidebar
                active={active}
                setActive={setActive}
            />

            <MobileNav
                active={active}
                setActive={setActive}
            />

            <main className="student-content">

                {active === "dashboard" && <Dashboard />}

                {active === "schedule" && <Schedule />}

                {active === "homework" && <Homework />}

                {active === "history" && <History />}

                {active === "payments" && <Payments />}

                {active === "notifications" && <Notifications />}

                {active === "profile" && <Profile />}

            </main>

        </Box>

    );

}