import { useMemo } from "react";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function getWeeks() {

    const weeks = [];

    const today = new Date();

    today.setHours(0,0,0,0);

    for(let w=0;w<4;w++){

        const week=[];

        const start=new Date(today);

        start.setDate(

            start.getDate()+w*7-start.getDay()

        );

        for(let i=0;i<7;i++){

            const day=new Date(start);

            day.setDate(start.getDate()+i);

            week.push(day);

        }

        weeks.push(week);

    }

    return weeks;

}

function isSameDay(a,b){

    if(!a || !b) return false;

    return(

        a.getFullYear()===b.getFullYear() &&

        a.getMonth()===b.getMonth() &&

        a.getDate()===b.getDate()

    );

}

export default function Calendar({

    selectedDate,

    setSelectedDate

}){

    const weeks=useMemo(

        ()=>getWeeks(),

        []

    );

    const today=new Date();

    today.setHours(0,0,0,0);

    return(

        <div className="calendar-card">

            <div className="calendar-top">

                <div>

                    <h2>

                        Календарь

                    </h2>

                    <p>

                        Выберите день занятия

                    </p>

                </div>

            </div>

            <div className="calendar-days">

                {

                    DAYS.map(day=>(

                        <div

                            key={day}

                            className="calendar-day-name"

                        >

                            {day}

                        </div>

                    ))

                }

            </div>

            <div className="calendar-body">

                {

                    weeks.map((week,index)=>(

                        <div

                            className="calendar-row"

                            key={index}

                        >

                            {

                                week.map((day)=>{

                                    const disabled=day<today;

                                    const active=isSameDay(

                                        selectedDate,

                                        day

                                    );

                                    return(

                                        <button

                                            key={day.toISOString()}

                                            disabled={disabled}

                                            onClick={()=>setSelectedDate(day)}

                                            className={`

                                            calendar-cell

                                            ${active?"active":""}

                                            ${disabled?"disabled":""}

                                            `}

                                        >

                                            <span>

                                                {day.getDate()}

                                            </span>

                                        </button>

                                    );

                                })

                            }

                        </div>

                    ))

                }

            </div>

            {

                selectedDate &&

                <div className="calendar-selected">

                    📅 Вы выбрали

                    <strong>

                        {" "}

                        {selectedDate.toLocaleDateString(

                            "ru-RU",

                            {

                                day:"numeric",

                                month:"long"

                            }

                        )}

                    </strong>

                </div>

            }

        </div>

    );

}