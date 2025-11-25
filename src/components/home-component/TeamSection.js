import Image from "next/image";

const teamMembers = [
  {
    name: "Saidat Sokoya",
    position: "Founder & Lead Instructor",
    photo: "/images/saidat.png",
  }
];

export default function TeamSection() {
  return (
    <section className="bg-amber-50 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our passionate team of certified artists brings years of creative expertise, proven teaching methodologies, and genuine dedication to your artistic growth.
          </p>
        </div>

        {/* Team Grid */}
        {/* <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 place-items-center mx-auto border"> */}
        <div className="grid gap-10 mx-auto place-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-center p-6"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-amber-900">{member.name}</h3>
              <p className="text-amber-700 font-medium">{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
