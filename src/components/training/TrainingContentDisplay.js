'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Calendar, Clock, Users, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';

export default function TrainingContentDisplay() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training-content');
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        // Find the published content
        const published = data.data.find(item => item.isPublished && item.isActive);
        if (published) {
          setContent(published);
        } else if (data.data.length > 0) {
          setContent(data.data[0]);
        }
      } else {
        setError('Training content not available at the moment');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load training content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
          <p className="text-gray-600 mt-4">Loading training information...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Training Not Available</h3>
              <p className="text-red-700 text-sm mt-1">{error || 'Please check back soon for training programs.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(content.nextSession.startDate);
  const endDate = new Date(content.nextSession.endDate);
  const isEarlyBirdActive = content.pricing.earlyBirdDeadline && new Date() <= new Date(content.pricing.earlyBirdDeadline);
  const currentPrice = isEarlyBirdActive ? content.pricing.earlyBirdPrice : content.pricing.standardPrice;
  const savings = content.pricing.standardPrice - content.pricing.earlyBirdPrice;
  const discountPercent = Math.round((savings / content.pricing.standardPrice) * 100);
  const currencySymbol = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€'
  }[content.pricing.currency] || '₦';

  const dateFormat = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 md:py-12 lg:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          {content.description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.description}
            </p>
          )}
        </div>

        {/* Status Banner */}
        {isEarlyBirdActive && (
          <div className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 md:p-6 flex items-start gap-4">
            <CheckCircle size={24} className="text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Early Bird Offer Active</h3>
              <p className="text-green-700 text-sm mt-1">
                Save {currencySymbol}{savings.toLocaleString()} ({discountPercent}%) with our early bird pricing until {new Date(content.pricing.earlyBirdDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Duration */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <Clock className="text-amber-900 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Duration</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {content.duration.value} {content.duration.unit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Class Size */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <Users className="text-amber-900 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Class Size</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {content.classSize.minimum}-{content.classSize.maximum} people
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Dates */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 md:p-6 hover:shadow-lg transition md:col-span-2">
                <div className="flex items-start gap-4">
                  <Calendar className="text-amber-900 shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-3">Next Session</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-600 text-sm">Start</p>
                        <p className="font-semibold text-gray-900">{dateFormat(startDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">End</p>
                        <p className="font-semibold text-gray-900">{dateFormat(endDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Location</p>
                        <p className="font-semibold text-gray-900">{content.nextSession.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Enrollment */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 md:p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Enrollment Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Current Enrollments</span>
                  <span className="font-bold text-gray-900">{content.classSize.current} / {content.classSize.maximum}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((content.classSize.current / content.classSize.maximum) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                {content.classSize.current >= content.classSize.maximum ? (
                  <p className="text-red-600 font-medium text-sm">Class is full. Join the waitlist?</p>
                ) : (
                  <p className="text-green-600 font-medium text-sm">
                    {content.classSize.maximum - content.classSize.current} spots available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8 sticky top-4">
              {/* Pricing Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Investment</h2>

              {/* Price Display */}
              <div className="mb-8">
                {isEarlyBirdActive ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm line-through">
                        {currencySymbol}{content.pricing.standardPrice.toLocaleString()}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-green-600">
                          {currencySymbol}{currentPrice.toLocaleString()}
                        </p>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Save {discountPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {currencySymbol}{currentPrice.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Early Bird Deadline */}
              {content.pricing.earlyBirdDeadline && (
                <div className="mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-gray-600">Early Bird Deadline</p>
                  <p className="font-semibold text-amber-900">
                    {new Date(content.pricing.earlyBirdDeadline).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              {/* <Link
                href="/training-registration"
                className="w-full bg-linear-to-r from-amber-900 to-amber-800 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-700 transition flex items-center justify-center gap-2 mb-4"
              >
                Register Now
                <ArrowRight size={18} />
              </Link> */}

              {/* Secondary Info */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Certificate of Completion</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Expert Instruction</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Practical Training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
