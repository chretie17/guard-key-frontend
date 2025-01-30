import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import { 
    CheckCircle, XCircle, RotateCcw, AlertCircle, Mail, Phone, 
    Building2, Users, Search, Filter, Calendar, MapPin 
} from 'lucide-react';

export default function AdminOutsiderRequests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        site: 'all',
        partner: 'all',
        dateRange: 'all'
    });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(Api.getUrl('/admin/outsider-requests'));
                setRequests(response.data);
                setFilteredRequests(response.data);
            } catch (err) {
                setError('Failed to fetch outsider requests.');
                console.error(err);
            }
        };
        fetchRequests();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, requests]);

    const applyFilters = () => {
        let filtered = [...requests];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(req => 
                req.name.toLowerCase().includes(searchTerm) ||
                req.email.toLowerCase().includes(searchTerm) ||
                req.site_name.toLowerCase().includes(searchTerm) ||
                req.reason.toLowerCase().includes(searchTerm)
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(req => req.status === filters.status);
        }

        // Site filter
        if (filters.site !== 'all') {
            filtered = filtered.filter(req => req.site_name === filters.site);
        }

        // Partner filter
        if (filters.partner !== 'all') {
            filtered = filtered.filter(req => req.partner_name === filters.partner);
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const past = new Date();
            switch (filters.dateRange) {
                case 'today':
                    past.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    past.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    past.setMonth(now.getMonth() - 1);
                    break;
            }
            filtered = filtered.filter(req => new Date(req.requested_time) >= past);
        }

        setFilteredRequests(filtered);
    };

    const updateRequestStatus = async (id, status) => {
        try {
            await axios.put(Api.getUrl(`/admin/outsider-requests/${id}/status`), { status });
            setRequests(requests.map(req => (req.id === id ? { ...req, status } : req)));
        } catch (err) {
            setError('Failed to update request status.');
            console.error(err);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500';
            case 'Denied':
                return 'bg-red-500';
            case 'Returned':
                return 'bg-[#F1404A]';
            default:
                return 'bg-blue-500';
        }
    };

    // Get unique values for filters
    const uniqueSites = [...new Set(requests.map(req => req.site_name))];
    const uniquePartners = [...new Set(requests.map(req => req.partner_name).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        {/* Header Section */}
                        <div className="flex flex-col items-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#F1404A]">
                                Partner Key Requests
                            </h2>
                            <p className="mt-2 text-gray-500 text-sm">
                                Showing {filteredRequests.length} of {requests.length} requests
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Filters Section */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F1404A]/20 focus:border-[#F1404A]"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F1404A]/20 focus:border-[#F1404A]"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Denied">Denied</option>
                                <option value="Returned">Returned</option>
                            </select>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F1404A]/20 focus:border-[#F1404A]"
                                value={filters.site}
                                onChange={(e) => setFilters(prev => ({ ...prev, site: e.target.value }))}
                            >
                                <option value="all">All Sites</option>
                                {uniqueSites.map(site => (
                                    <option key={site} value={site}>{site}</option>
                                ))}
                            </select>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F1404A]/20 focus:border-[#F1404A]"
                                value={filters.partner}
                                onChange={(e) => setFilters(prev => ({ ...prev, partner: e.target.value }))}
                            >
                                <option value="all">All Partners</option>
                                {uniquePartners.map(partner => (
                                    <option key={partner} value={partner}>{partner}</option>
                                ))}
                            </select>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F1404A]/20 focus:border-[#F1404A]"
                                value={filters.dateRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            >
                                <option value="all">All Time</option>
                                <option value="today">Last 24 Hours</option>
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                            </select>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid gap-6">
                            {filteredRequests.map(request => (
                                <div 
                                    key={request.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            {/* Left Section - Basic Info */}
                                            <div className="flex-grow space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {request.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">ID: #{request.id}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusBadgeColor(request.status)}`}>
                                                        {request.status === 'Approved' && <CheckCircle className="h-4 w-4" />}
                                                        {request.status === 'Denied' && <XCircle className="h-4 w-4" />}
                                                        {request.status === 'Returned' && <RotateCcw className="h-4 w-4" />}
                                                        {request.status === 'Pending' && <AlertCircle className="h-4 w-4" />}
                                                        {request.status}
                                                    </span>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="h-4 w-4" />
                                                        <span className="text-sm">{request.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span className="text-sm">{request.phone}</span>
                                                    </div>
                                                </div>

                                                {/* Site & Partner Info */}
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="text-sm">{request.site_name}</span>
                                                    </div>
                                                    {request.partner_name && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Users className="h-4 w-4" />
                                                            <span className="text-sm">{request.partner_name}</span>
                                                        </div>
                                                    )}
                                                    {request.location && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <MapPin className="h-4 w-4" />
                                                            <span className="text-sm">{request.location}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Request Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="text-sm">
                                                            Requested: {formatDateTime(request.requested_time)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Reason: {request.reason}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Section - Actions */}
                                            <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                                                <button
                                                    onClick={() => updateRequestStatus(request.id, 'Approved')}
                                                    disabled={request.status === 'Approved'}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 
                                                        bg-green-500 hover:bg-green-600 disabled:bg-green-300 
                                                        text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateRequestStatus(request.id, 'Denied')}
                                                    disabled={request.status === 'Denied'}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 
                                                        bg-red-500 hover:bg-red-600 disabled:bg-red-300 
                                                        text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Deny
                                                </button>
                                                <button
                                                    onClick={() => updateRequestStatus(request.id, 'Returned')}
                                                    disabled={request.status === 'Returned'}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 
                                                        bg-[#F1404A] hover:bg-[#E13A44] disabled:bg-[#F1404A]/50 
                                                        text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                    Return
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Filter className="h-12 w-12 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                                        <p className="text-gray-500 max-w-sm">
                                            No requests match your current filter criteria. Try adjusting your filters or clear them to see all requests.
                                        </p>
                                        <button
                                            onClick={() => setFilters({
                                                search: '',
                                                status: 'all',
                                                site: 'all',
                                                partner: 'all',
                                                dateRange: 'all'
                                            })}
                                            className="mt-2 text-[#F1404A] hover:text-[#E13A44] font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}