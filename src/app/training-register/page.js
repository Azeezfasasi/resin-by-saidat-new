import React from 'react';
import TrainingRegistrationForm from '@/components/training/TrainingRegistrationForm';
import { ArrowRight, Check } from 'lucide-react';
import TrainingContentDisplay from '@/components/training/TrainingContentDisplay';
import Link from 'next/link';

export default function TrainingRegister() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">

      <TrainingContentDisplay />

      {/* CTA Button */}
      <div className='max-w-[200px] lg:max-w-[400px] mx-auto mt-0 lg:mt-[-30px] mb-4 lg:mb-8'>
        <Link
        href="#registernow"
        className="w-full bg-linear-to-r from-amber-900 to-amber-800 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-700 transition flex items-center justify-center gap-2 mb-4"
        >
          Register Now
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Registration Form */}
      <div id='registernow'>
        <TrainingRegistrationForm />
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">Who can attend?</h3>
            <p className="text-gray-700">
              The training is perfect for beginners and experienced crafters alike. No prior experience required!
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">What&apos;s included in the training?</h3>
            <p className="text-gray-700">
              Complete materials, professional tools, hands-on guidance, business consulting, and a certificate of completion.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">What will I learn?</h3>
            <p className="text-gray-700">
              Resin pouring techniques, color mixing, design principles, troubleshooting, product photography, and how to start your resin business.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">Is there a payment plan?</h3>
            <p className="text-gray-700">
              Yes! We offer flexible payment plans. Contact us for details after registration.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">What if I need to cancel?</h3>
            <p className="text-gray-700">
              Full refund available if cancelled 14 days before the start date. 50% refund within 7 days.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-700 mb-2">Do I get a certificate?</h3>
            <p className="text-gray-700">
              Yes, upon successful completion of the training, you will receive a certificate recognizing your achievement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

