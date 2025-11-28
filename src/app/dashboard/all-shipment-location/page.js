'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function AllShipmentLocationPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch all delivery locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/delivery-location');
      setLocations(response.data.locations || []);
    } catch (err) {
      setError('Failed to load delivery locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter locations based on search and status
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && loc.isActive) || 
      (filterStatus === 'inactive' && !loc.isActive);
    return matchesSearch && matchesStatus;
  });

  // Handle edit click
  const handleEditClick = (location) => {
    setEditingId(location._id);
    setEditFormData({
      name: location.name,
      shippingCost: location.shippingCost,
      estimatedDays: location.estimatedDays,
      description: location.description || '',
      coverageAreas: location.coverageAreas?.join(', ') || ''
    });
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.name.trim() || !editFormData.shippingCost || !editFormData.estimatedDays) {
      setError('Name, shipping cost, and estimated days are required');
      return;
    }

    try {
      const payload = {
        name: editFormData.name.trim(),
        shippingCost: parseFloat(editFormData.shippingCost),
        estimatedDays: parseInt(editFormData.estimatedDays),
        description: editFormData.description.trim(),
        coverageAreas: editFormData.coverageAreas
          .split(',')
          .map(area => area.trim())
          .filter(area => area.length > 0)
      };

      await axios.put(`/api/delivery-location/${editingId}`, payload);
      setEditingId(null);
      setEditFormData(null);
      await fetchLocations();
      setError('');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('A delivery location with this name already exists');
      } else {
        setError('Failed to update location');
      }
      console.error('Error updating location:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delivery-location/${id}`);
      setDeleteConfirmId(null);
      await fetchLocations();
      setError('');
    } catch (err) {
      setError('Failed to delete location');
      console.error('Error deleting location:', err);
    }
  };

  // Handle toggle active status
  const handleToggleStatus = async (id) => {
    try {
      setTogglingId(id);
      await axios.patch(`/api/delivery-location/${id}?action=toggle`);
      await fetchLocations();
      setError('');
    } catch (err) {
      setError('Failed to toggle status');
      console.error('Error toggling status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Delivery Locations
            </h1>
            <p className="text-slate-600">
              Manage your shipping and delivery locations
            </p>
          </div>
          <Link
            href="/dashboard/add-shipment-location"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Location
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Locations</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredLocations.length} of {locations.length} locations
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin">
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLocations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No locations found</h3>
            <p className="text-slate-600 mb-6">Start by creating your first delivery location</p>
            <Link
              href="/dashboard/add-shipment-location"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Location
            </Link>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && filteredLocations.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {filteredLocations.map(location => (
              <div
                key={location._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Editing Mode */}
                {editingId === location._id ? (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Edit Location</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Location Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Shipping Cost (₦) *
                          </label>
                          <input
                            type="number"
                            name="shippingCost"
                            value={editFormData.shippingCost}
                            onChange={handleEditChange}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Estimated Days *
                          </label>
                          <input
                            type="number"
                            name="estimatedDays"
                            value={editFormData.estimatedDays}
                            onChange={handleEditChange}
                            min="1"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          rows="2"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Coverage Areas (comma-separated)
                        </label>
                        <textarea
                          name="coverageAreas"
                          value={editFormData.coverageAreas}
                          onChange={handleEditChange}
                          rows="2"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditFormData(null);
                          }}
                          className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900">
                              {location.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              location.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {location.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {location.description && (
                            <p className="text-slate-600 mb-4">{location.description}</p>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                                Shipping Cost
                              </p>
                              <p className="text-lg font-semibold text-slate-900">
                                ₦{location.shippingCost.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                                Est. Delivery
                              </p>
                              <p className="text-lg font-semibold text-slate-900">
                                {location.estimatedDays} day{location.estimatedDays !== 1 ? 's' : ''}
                              </p>
                            </div>
                            {location.coverageAreas && location.coverageAreas.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                                  Coverage
                                </p>
                                <p className="text-sm text-slate-700">
                                  {location.coverageAreas.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => handleToggleStatus(location._id)}
                          disabled={togglingId === location._id}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            location.isActive
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          } ${togglingId === location._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {location.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleEditClick(location)}
                          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-semibold hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(location._id)}
                          className="px-4 py-2 text-red-600 bg-red-50 rounded-lg font-semibold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Location?</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this delivery location? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
