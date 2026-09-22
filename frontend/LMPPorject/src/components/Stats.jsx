export default function Stats() {
  const stats = [
    ["50+", "Учеников"],
    ["95%", "Успеха"],
    ["300+", "Проведённых уроков"],
    ["7+", "Лет Опыта"],
  ];

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([number, label]) => (
          <div key={label} className="clay-card p-8 text-center">
            <h3 className="text-4xl font-black text-[#ff6b6b] mb-2">{number}</h3>
            <p className="text-sm text-[#6b6b80] font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
