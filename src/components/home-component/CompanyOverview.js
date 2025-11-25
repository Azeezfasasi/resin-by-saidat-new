"use client";
import React from "react";
import Image from "next/image";

export default function CompanyOverview() {
  return (
    <>
      {/* Company Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/projectplaceholder.png"
                  alt="Resin by Saidat - Art Training"
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Resin by Saidat is a premier art training academy dedicated to unlocking creative potential and teaching modern resin art techniques. Founded with a passion for artistic excellence and creative empowerment, we provide comprehensive training in resin art, mixed media, and contemporary creative practices.
                </p>
                <p>
                  Our academy brings together years of hands-on artistic experience and proven teaching methodologies. We specialize in resin art training, epoxy techniques, jewelry making, and decorative piece creation. Our instructors are certified professionals with a proven track record of transforming beginners into confident artists.
                </p>
                <p>
                  Every student receives personalized attention, professional-grade materials, and guidance through every step of their creative journey. We create a supportive community where innovation thrives and artistic dreams become reality.
                </p>
                <p className="text-amber-900 font-semibold text-lg pt-2">
                  Our mission: to inspire and empower creatives worldwide through accessible, professional art training and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8">Our Vision</h2>
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 border-l-4 border-amber-600">
              <p className="text-xl text-gray-700 leading-relaxed">
                To be a globally recognized center of excellence for creative artistry, where aspiring artists discover their passion, develop professional skills, and build thriving creative careers through accessible, transformative art education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8">Our Mission</h2>
            <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg shadow-md p-8 md:p-12 border-l-4 border-amber-600">
              <p className="text-xl text-gray-700 leading-relaxed">
                To provide world-class art training through expert instruction, hands-on practice, and a nurturing creative community. We empower students with technical skills, artistic confidence, and the knowledge to transform their creative passions into professional opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-12 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Creativity */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a6 6 0 016 6v4a6 6 0 016 6v4a2 2 0 01-2 2h-4.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Creativity</h3>
              <p className="text-gray-600 text-sm">We celebrate artistic expression and innovative thinking in all we do.</p>
            </div>

            {/* Empowerment */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Empowerment</h3>
              <p className="text-gray-600 text-sm">We empower every artist to reach their full creative potential.</p>
            </div>

            {/* Excellence */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">Premium instruction and high standards in every class.</p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.697M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">A supportive network of artists growing together.</p>
            </div>

            {/* Passion */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Passion</h3>
              <p className="text-gray-600 text-sm">Dedicated to the art form and to your artistic journey.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
