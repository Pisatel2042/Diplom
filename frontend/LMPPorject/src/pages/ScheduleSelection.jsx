import { useState, useMemo, useEffect } from "react";

import Calendar from "../components/schedule/Calendar";
import TimeSlots from "../components/schedule/TimeSlots";
import SummaryCard from "../components/schedule/SummaryCard";
import PaymentModal from "../components/schedule/PaymentModal";
import SuccessModal from "../components/schedule/SuccessModal";

import "../styles/ScheduleSelection.css";

const PRICE_PER_LESSON = 1500;

export default function ScheduleSelection() {

    const API_URL = import.meta.env.VITE_API_URL;

    const userId = localStorage.getItem("userId");

    const [selectedDate, setSelectedDate] = useState(null);

    const [selectedLessons, setSelectedLessons] = useState([]);

    const [busyLessons, setBusyLessons] = useState([]);

    const [showPayment, setShowPayment] = useState(false);

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {

        fetch(`${API_URL}/api/schedule/busy`)
            .then(res => res.ok ? res.json() : [])
            .then(data => Array.isArray(data) ? setBusyLessons(data) : setBusyLessons([]));

    }, []);

    const total = useMemo(() => {

        return selectedLessons.length * PRICE_PER_LESSON;

    }, [selectedLessons]);

    function addLesson(time) {

        const busy = busyLessons.find(

            x =>

                x.date === selectedDate &&
                x.time === time

        );

        if (busy) {

            alert("Это время уже занято");

            return;

        }

        const exists = selectedLessons.find(

            lesson =>

                lesson.date === selectedDate &&
                lesson.time === time

        );

        if (exists) {

            setSelectedLessons(

                selectedLessons.filter(

                    lesson =>

                        !(lesson.date === selectedDate && lesson.time === time)

                )

            );

            return;

        }

        setSelectedLessons([

            ...selectedLessons,

            {

                date: selectedDate,

                time

            }

        ]);

    }

    function removeLesson(index) {

        setSelectedLessons(

            selectedLessons.filter(

                (_, i) => i !== index

            )

        );

    }

    async function payment() {

        for (const lesson of selectedLessons) {

            await fetch(`${API_URL}/api/schedule`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    studentId: Number(userId),

                    date: lesson.date,

                    time: lesson.time

                })

            });

        }

        setShowPayment(false);

        setPaymentSuccess(true);

        setTimeout(() => {

            window.location = "/account";

        }, 2000);

    }

    return (

        <div className="schedule-page">

            {

                paymentSuccess &&

                <SuccessModal />

            }

            {

                showPayment &&

                <PaymentModal

                    total={total}

                    lessons={selectedLessons.length}

                    onClose={() => setShowPayment(false)}

                    onSuccess={payment}

                />

            }

            <div className="schedule-header">

                <div className="schedule-icon">

                    📅

                </div>

                <h1>

                    Запись на занятия

                </h1>

                <p>

                    Выберите удобную дату и время

                </p>

            </div>

            <div className="schedule-grid">

                <div className="schedule-left">

                    <Calendar

                        selectedDate={selectedDate}

                        setSelectedDate={setSelectedDate}

                    />

                    {

                        selectedDate &&

                        <TimeSlots

                            selectedDate={selectedDate}

                            selectedLessons={selectedLessons}

                            busyLessons={busyLessons}

                            addLesson={addLesson}

                        />

                    }

                </div>

                <div className="schedule-right">

                    <SummaryCard

                        lessons={selectedLessons}

                        total={total}

                        removeLesson={removeLesson}

                        openPayment={() => setShowPayment(true)}

                    />

                </div>

            </div>

        </div>

    );

}