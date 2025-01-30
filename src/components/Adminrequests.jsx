
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import { AlertCircle, CheckCircle, XCircle, RotateCcw, Trash2, Search, Filter } from 'lucide-react';

export default function AdminManageRequests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        site: 'all',
        dateRange: 'all'
    });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(Api.getUrl('/requests/all'));
                setRequests(response.data);
                setFilteredRequests(response.data);
            } catch (err) {
                setError('Failed to fetch requests.');
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
                req.username.toLowerCase().includes(searchTerm) ||
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
            filtered = filtered.filter(req => new Date(req.request_date) >= past);
        }

        setFilteredRequests(filtered);
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

    const updateRequestStatus = async (id, status) => {
        try {
            await axios.put(Api.getUrl(`/requests/update-status/${id}`), { status });
            setRequests(requests.map(req => (req.id === id ? { ...req, status } : req)));
        } catch (err) {
            setError('Failed to update request status.');
            console.error(err);
        }
    };

    const deleteRequest = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await axios.delete(Api.getUrl(`/requests/${id}`));
                setRequests(requests.filter(req => req.id !== id));
            } catch (err) {
                setError('Failed to delete request.');
                console.error(err);
            }
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500';
            case 'Denied':
                return 'bg-red-500';
            case 'Returned':
                return 'bg-[#E13A44]';
            default:
                return 'bg-blue-500';
        }
    };

    // Get unique sites for filter
    const uniqueSites = [...new Set(requests.map(req => req.site_name))];

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="max-w-8xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-[#E13A44]">
                                Manage Key Requests
                            </h2>
                            <div className="text-sm text-gray-500">
                                Showing {filteredRequests.length} of {requests.length} requests
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Filters Section */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                value={filters.site}
                                onChange={(e) => setFilters(prev => ({ ...prev, site: e.target.value }))}
                            >
                                <option value="all">All Sites</option>
                                {uniqueSites.map(site => (
                                    <option key={site} value={site}>{site}</option>
                                ))}
                            </select>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                value={filters.dateRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            >
                                <option value="all">All Time</option>
                                <option value="today">Last 24 Hours</option>
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                            </select>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#E13A44]">
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-white">#ID</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-white">User</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-white">Site</th>
                                        <th className="hidden md:table-cell px-4 py-2.5 text-left text-xs font-semibold text-white">Request Date</th>
                                        <th className="hidden md:table-cell px-4 py-2.5 text-left text-xs font-semibold text-white">Scheduled Time</th>
                                        <th className="hidden lg:table-cell px-4 py-2.5 text-left text-xs font-semibold text-white">Reason</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-white">Status</th>
                                        <th className="px-4 py-2.5 text-center text-xs font-semibold text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRequests.map(request => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-xs text-gray-900">#{request.id}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{request.username}</td>
                                            <td className="px-4 py-3 text-xs text-gray-900">{request.site_name}</td>
                                            <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-500">
                                                {formatDateTime(request.request_date)}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-500">
                                                {formatDateTime(request.requested_time)}
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-500">
                                                {request.reason}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusBadgeColor(request.status)}`}>
                                                    {request.status === 'Approved' && <CheckCircle className="h-3 w-3" />}
                                                    {request.status === 'Denied' && <XCircle className="h-3 w-3" />}
                                                    {request.status === 'Returned' && <RotateCcw className="h-3 w-3" />}
                                                    {request.status === 'Pending' && <AlertCircle className="h-3 w-3" />}
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => updateRequestStatus(request.id, 'Approved')}
                                                        className={`group relative p-1 rounded-full hover:bg-green-50 transition-colors ${
                                                            request.status === 'Approved' ? 'bg-green-50' : ''
                                                        }`}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className={`h-4 w-4 ${
                                                            request.status === 'Approved' ? 'text-green-500' : 'text-green-400'
                                                        } group-hover:text-green-500`} />
                                                        <span className="sr-only">Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => updateRequestStatus(request.id, 'Denied')}
                                                        className={`group relative p-1 rounded-full hover:bg-red-50 transition-colors ${
                                                            request.status === 'Denied' ? 'bg-red-50' : ''
                                                        }`}
                                                        title="Deny"
                                                    >
                                                        <XCircle className={`h-4 w-4 ${
                                                            request.status === 'Denied' ? 'text-red-500' : 'text-red-400'
                                                        } group-hover:text-red-500`} />
                                                        <span className="sr-only">Deny</span>
                                                    </button>
                                                    <button
                                                        onClick={() => updateRequestStatus(request.id, 'Returned')}
                                                        className={`group relative p-1 rounded-full hover:bg-[#fff1f2] transition-colors ${
                                                            request.status === 'Returned' ? 'bg-[#fff1f2]' : ''
                                                        }`}
                                                        title="Return"
                                                    >
                                                        <RotateCcw className={`h-4 w-4 ${
                                                            request.status === 'Returned' ? 'text-[#E13A44]' : 'text-[#E13A44]/80'
                                                        } group-hover:text-[#E13A44]`} />
                                                        <span className="sr-only">Return</span>
                                                    </button>
                                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                    <button
                                                        onClick={() => deleteRequest(request.id)}
                                                        className="group relative p-1 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-400 group-hover:text-red-500" />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Filter className="h-8 w-8 text-gray-400" />
                                                    <p className="text-sm">No requests found matching your filters</p>
                                                    <button
                                                        onClick={() => setFilters({
                                                            search: '',
                                                            status: 'all',
                                                            site: 'all',
                                                            dateRange: 'all'
                                                        })}
                                                        className="text-[#E13A44] hover:text-[#E13A44]/80 text-sm font-medium"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}