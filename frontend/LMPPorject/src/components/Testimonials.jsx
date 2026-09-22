const reviews = [
  { name: "Alex", text: "I finally started speaking confidently." },
  { name: "Maria", text: "Best English teacher I've worked with." },
  { name: "Daniel", text: "Passed my interview in English." },
];

export default function Testimonials() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-black text-center mb-20">Testimonials</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.name} className="glass rounded-[32px] p-10">
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                &ldquo;{review.text}&rdquo;
              </p>
              <h4 className="font-bold">{review.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
