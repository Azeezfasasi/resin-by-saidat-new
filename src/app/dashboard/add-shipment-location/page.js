'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AddShipmentLocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    shippingCost: '',
    estimatedDays: '',
    description: '',
    coverageAreas: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.shippingCost || !formData.estimatedDays) {
        setError('Name, shipping cost, and estimated days are required');
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        shippingCost: parseFloat(formData.shippingCost),
        estimatedDays: parseInt(formData.estimatedDays),
        description: formData.description.trim(),
        coverageAreas: formData.coverageAreas
          .split(',')
          .map(area => area.trim())
          .filter(area => area.length > 0)
      };

      const response = await axios.post('/api/delivery-location', payload);

      if (response.status === 201) {
        setSuccess('Delivery location created successfully!');
        setFormData({
          name: '',
          shippingCost: '',
          estimatedDays: '',
          description: '',
          coverageAreas: ''
        });

        // Redirect to all locations page after 1.5 seconds
        setTimeout(() => {
          router.push('/dashboard/all-shipment-location');
        }, 1500);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A delivery location with this name already exists');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create delivery location. Please try again.');
      }
      console.error('Error creating delivery location:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Add Delivery Location
          </h1>
          <p className="text-slate-600">
            Create a new shipping/delivery location for your products
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Location Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Within Lagos, Nationwide, International"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Give this location a unique, descriptive name</p>
            </div>

            {/* Shipping Cost */}
            <div>
              <label htmlFor="shippingCost" className="block text-sm font-semibold text-slate-900 mb-2">
                Shipping Cost (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="shippingCost"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Base shipping cost for this location</p>
            </div>

            {/* Estimated Days */}
            <div>
              <label htmlFor="estimatedDays" className="block text-sm font-semibold text-slate-900 mb-2">
                Estimated Delivery Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="estimatedDays"
                name="estimatedDays"
                value={formData.estimatedDays}
                onChange={handleInputChange}
                placeholder="e.g., 2"
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Typical number of days for delivery</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add details about this delivery location..."
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Additional information about this location</p>
            </div>

            {/* Coverage Areas */}
            <div>
              <label htmlFor="coverageAreas" className="block text-sm font-semibold text-slate-900 mb-2">
                Coverage Areas (Optional)
              </label>
              <textarea
                id="coverageAreas"
                name="coverageAreas"
                value={formData.coverageAreas}
                onChange={handleInputChange}
                placeholder="e.g., Lagos, Ogun, Oyo"
                rows="2"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Comma-separated list of areas covered by this location</p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Location
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="py-3 px-6 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
            <li>Names must be unique and descriptive (e.g., &quot;Within Lagos&quot;, &quot;Nationwide Express&quot;)</li>
            <li>Shipping cost will be used when customers select this delivery option</li>
            <li>Delivery days helps customers set expectations</li>
            <li>You can activate/deactivate locations from the management page anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
