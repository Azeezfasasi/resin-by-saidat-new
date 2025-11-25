export default function HistoryMilestones() {
  const milestones = [
    { year: "2020", title: "Creative Vision Begins", description: "Resin by Saidat was founded by visionary artist Saidat with a passion for sharing the beauty and creativity of resin art with the world." },
    { year: "2021", title: "First Training Class", description: "Launched our inaugural resin art training program with a small group of eager students who discovered their creative potential." },
    { year: "2022", title: "Expansion & Recognition", description: "Expanded curriculum to include advanced techniques, mixed media, and jewelry making. Gained recognition for transformative art education." },
    { year: "2023", title: "Studio Growth", description: "Opened our state-of-the-art training studio with professional equipment, providing students with premier facilities for hands-on learning." },
    { year: "2024-2025", title: "Community Leader", description: "Established Resin by Saidat as a leading art academy, building a thriving community of professional artists and creative entrepreneurs." },
  ];

  return (
    <section className="bg-linear-to-b from-white to-amber-50 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-4">Our Creative Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From a passionate vision to a thriving art academy, Resin by Saidat has grown to inspire and empower creative minds worldwide.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-amber-600 ml-4 md:ml-12">
          {milestones.map((milestone, index) => (
            <div key={index} className="mb-10 ml-6 md:ml-12 relative">
              {/* Dot */}
              <span className="absolute -left-4 md:-left-6 w-4 h-4 bg-amber-600 rounded-full top-1.5 md:top-2"></span>
              
              {/* Content */}
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-amber-900">{milestone.year} - {milestone.title}</h3>
                <p className="text-gray-600 mt-2">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
