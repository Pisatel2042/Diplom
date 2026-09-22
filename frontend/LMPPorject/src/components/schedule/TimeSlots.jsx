const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

function formatDate(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long"
  });
}

export default function TimeSlots({
  selectedDate,
  selectedLessons,
  busyLessons,
  addLesson
}) {
  return (
    <div className="times-card">
      <div className="times-header">
        <h2>Выберите время</h2>
        <p>{formatDate(selectedDate)}</p>
      </div>
      <div className="times-grid">
        {TIME_SLOTS.map((time) => {
          const active = selectedLessons.some(
            lesson => lesson.date?.getTime() === selectedDate.getTime() && lesson.time === time
          );
          const busy = busyLessons.some(
            lesson => new Date(lesson.date).toDateString() === selectedDate.toDateString() && lesson.time === time
          );
          return (
            <button
              key={time}
              disabled={busy}
              className={
                busy ? "time-btn busy" : active ? "time-btn active" : "time-btn"
              }
              onClick={() => addLesson(time)}
            >
              <span>🕒</span>
              {time}
              {busy && " (занято)"}
            </button>
          );
        })}
      </div>
      <div className="times-info">
        <div>💡 Нажмите ещё раз на выбранное время, чтобы убрать его из списка.</div>
        <div>🔒 Серые кнопки уже заняты другим учеником.</div>
      </div>
    </div>
  );
}