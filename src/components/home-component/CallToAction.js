import { Sparkles, ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="relative bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-white py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <Sparkles size={48} className="text-white drop-shadow-lg" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Master the Art of Resin Crafting
        </h2>

        {/* Description */}
        <p className="text-amber-50 max-w-3xl mx-auto mb-4 text-lg">
          Learn professional resin pouring, mixing, and design techniques from <span className="font-semibold">Saidat herself</span>. Discover how to create stunning jewelry, home décor, and functional art pieces that sell.
        </p>

        <p className="text-amber-100 max-w-3xl mx-auto mb-10 text-lg">
          Join our hands-on training workshop and unlock your creative potential. Perfect for beginners and experienced crafters alike.
        </p>

        {/* Training Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-2">Expert Training</h4>
            <p className="text-sm text-amber-50">Learn from industry professionals</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-2">Hands-On Practice</h4>
            <p className="text-sm text-amber-50">Create your own masterpiece</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-2">Career Ready</h4>
            <p className="text-sm text-amber-50">Start your resin business</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/training-register"
            className="bg-white text-amber-700 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2 group"
          >
            Register for Training
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </a>
          <a
            href="/training-details"
            className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition duration-200"
          >
            Learn More
          </a>
        </div>

        {/* Additional Info */}
        <p className="text-amber-100 text-sm mt-8">
          Limited spots available • Next session starts in 2 weeks
        </p>
      </div>
    </section>
  );
}
