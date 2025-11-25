import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Adewale",
    position: "Project Manager, Alpha Industries",
    message:
      "Rayob Engineering delivered beyond expectations. Their team showed exceptional professionalism and technical expertise throughout our factory upgrade project.",
  },
  {
    id: 2,
    name: "Maria Okafor",
    position: "Director, GreenBuild Ltd.",
    message:
      "The Rayob team provided innovative solutions that reduced our construction costs and improved overall efficiency. Highly recommended for quality engineering services.",
  },
  {
    id: 3,
    name: "Engr. David Uche",
    position: "CEO, Uche Group",
    message:
      "They combine strong technical skills with a great sense of client service. Every project we’ve done with Rayob Engineering has been a success story.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from some of our satisfied clients who have trusted Rayob
            Engineering with their projects.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Message */}
              <p className="text-gray-600 mb-6 italic">
                “{testimonial.message}”
              </p>

              {/* Author */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/contact-us"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition"
          >
            Work With Us
          </a>
        </div>
      </div>
    </section>
  );
}
