import Image from 'next/image';
import { Heart, Sparkles, Award } from 'lucide-react';

export default function HomeAbout() {
  return (
    <section className="bg-linear-to-b from-white to-amber-50 py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-amber-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles size={36} className="text-amber-600" />
            About Resin by Saidat
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the story behind our beautiful handcrafted resin creations
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Image */}
          <div className="flex-1 w-full">
            <div className="relative w-full h-64 md:h-80 lg:h-135 rounded-2xl overflow-hidden shadow-2xl hover:shadow-lg transition duration-300">
              <Image
                src="/images/saidat.png" 
                alt="Resin by Saidat Artisan"
                fill
                sizes='100%'
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-amber-900 mb-6">
              Crafted with Passion & Precision
            </h3>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Welcome to Resin by Saidat, where art meets craftsmanship. We create stunning, hand-poured resin pieces that transform ordinary spaces into extraordinary showcases of beauty and elegance.
              </p>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                Each piece is meticulously crafted with premium materials, vibrant colors, and innovative designs. From jewelry and home décor to functional art pieces, every creation tells a unique story and brings joy to those who own it.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                Our commitment to quality, sustainability, and creative excellence has made us a trusted source for luxury resin art across Nigeria and beyond.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <Heart className="text-red-500 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Handcrafted</h4>
                  <p className="text-sm text-gray-600">Made with love & care</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Award className="text-amber-600 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                  <p className="text-sm text-gray-600">Using finest materials</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="text-amber-500 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Unique Designs</h4>
                  <p className="text-sm text-gray-600">Custom & original pieces</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="text-amber-600 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sustainable</h4>
                  <p className="text-sm text-gray-600">Eco-conscious practices</p>
                </div>
              </div>
            </div>

            <a
              href="/about-us"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition duration-200"
            >
              Learn Our Story
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
