import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Sidebar from "../components/teacher/Sidebar";
import MobileNav from "../components/teacher/MobileNav";

import Dashboard from "../components/teacher/Dashboard";
import Students from "../components/teacher/Students";
import Schedule from "../components/teacher/Schedule";
import Homework from "../components/teacher/Homework";
import History from "../components/teacher/History";
import Notify from "../components/teacher/Notify";

import "../styles/teacher.css";

export default function TeacherPanel() {

    const [active, setActive] = useState("dashboard");

    const [selectedStudentId, setSelectedStudentId] = useState(null);

    return (

        <Box className="teacher-page">

            <Sidebar
                active={active}
                setActive={setActive}
            />

            <MobileNav
                active={active}
                setActive={setActive}
            />

            <main className="teacher-content">

                {active === "dashboard" && <Dashboard />}

                {active === "students" && (

                    <Students

                        setActiveTab={setActive}

                        setSelectedStudentId={setSelectedStudentId}

                    />

                )}

                {active === "schedule" && <Schedule />}

                {active === "homework" && (

                    <Homework

                        selectedStudentId={selectedStudentId}

                    />

                )}

                {active === "history" && <History />}

                {active === "notify" && <Notify />}

            </main>

        </Box>

    );

}