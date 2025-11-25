'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Users, Check } from 'lucide-react';

export default function TrainingRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: 'beginner',
    city: '',
    occupation: '',
    sessionDate: 'december',
    referralSource: '',
    agreeTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/training-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          experience: 'beginner',
          city: '',
          occupation: '',
          sessionDate: 'december',
          referralSource: '',
          agreeTerms: false,
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="text-green-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-green-900">Registration Successful!</h3>
            <p className="text-green-800 text-sm">
              Thank you for registering. We&apos;ll send you a confirmation email shortly with payment details and next steps.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">
            There was an error submitting your registration. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Users size={24} />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={18} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={18} />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="+234 800 000 0000"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                City/Location *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="Lagos"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="e.g. Marketing Manager"
              />
            </div>
          </div>
        </div>

        {/* Experience & Preference Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Calendar size={24} />
            Experience & Preference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="beginner">Beginner - No experience</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Professional experience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Session *
              </label>
              <select
                name="sessionDate"
                value={formData.sessionDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="december">December 15 - 19, 2025</option>
                <option value="january">January 12 - 16, 2026</option>
                <option value="february">February 9 - 13, 2026</option>
                <option value="march">March 9 - 13, 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            How did you hear about us?
          </label>
          <textarea
            name="referralSource"
            value={formData.referralSource}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            placeholder="Social media, friend referral, website search, etc."
            rows="3"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              I agree to the training terms and conditions, and consent to receive updates about the training program via email or SMS. *
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-linear-to-r from-amber-700 to-amber-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-amber-800 hover:to-amber-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Complete Registration'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          By registering, you agree to our privacy policy and terms of service. We&apos;ll contact you within 24 hours to confirm your spot.
        </p>
      </form>

      
    </div>
  );
}
