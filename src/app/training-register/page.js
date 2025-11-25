import React from 'react';
import TrainingRegistrationForm from '@/components/training/TrainingRegistrationForm';
import { Check } from 'lucide-react';

export default function TrainingRegister() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Resin Art Training Registration
          </h1>
          <p className="text-xl text-amber-700 mb-2">
            Learn the art of professional resin crafting from Saidat
          </p>
          <p className="text-gray-600">
            Master pouring, mixing, design, and business skills in our hands-on workshop
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-700">
            <h3 className="font-semibold text-amber-900 mb-2">Duration</h3>
            <p className="text-gray-700">5 Days Intensive Workshop</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
            <h3 className="font-semibold text-amber-900 mb-2">Class Size</h3>
            <p className="text-gray-700">Limited to 15 participants</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <h3 className="font-semibold text-amber-900 mb-2">Next Session</h3>
            <p className="text-gray-700">Starts December 15, 2025</p>
          </div>
        </div>

        {/* Pricing Section */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Training Investment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-amber-50 to-white p-6 rounded-lg border-2 border-amber-200">
            <h3 className="text-xl font-bold text-amber-900 mb-2">Standard Price</h3>
            <p className="text-4xl font-bold text-amber-700 mb-4">₦150,000</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                5 days intensive training
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                All materials included
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Certificate of completion
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                Business consultation
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-amber-700 to-amber-800 p-6 rounded-lg text-white">
            <div className="inline-block bg-amber-500 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
              EARLY BIRD
            </div>
            <h3 className="text-xl font-bold mb-2">Early Bird (Limited)</h3>
            <p className="text-4xl font-bold mb-4">₦120,000</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-amber-200" />
                5 days intensive training
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-amber-200" />
                All materials included
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-amber-200" />
                Certificate of completion
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-amber-200" />
                Business consultation
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-amber-200" />
                Exclusive mentorship (3 months)
              </li>
            </ul>
            <p className="text-xs text-amber-100 mt-4">Valid for first 10 registrations</p>
          </div>
        </div>
      </div>
      </div>

      {/* Registration Form */}
      <TrainingRegistrationForm />

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
        </div>
      </div>
    </div>
  );
}
