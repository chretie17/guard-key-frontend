import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import { History, Building, Calendar, Clock, FileText, CheckCircle, XCircle, Clock3 } from "lucide-react";

const RequestHistory = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(Api.getUrl(`/requests/user-requests/${userId}`));
                setRequests(response.data);
            } catch (err) {
                setError('Failed to fetch requests.');
                console.error(err);
            }
        };
        if (userId) fetchRequests();
    }, [userId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'Denied':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock3 className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Denied':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-[#E13A44]/10 rounded-full">
                            <History className="h-8 w-8 text-[#E13A44]" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-[#E13A44] mb-2">
                        Your Key Request History
                    </h2>
                    <p className="text-center text-gray-600">
                        Track and manage your key requests
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#E13A44]">
                                    <th className="px-6 py-4 text-white font-semibold text-left">ID</th>
                                    <th className="px-6 py-4 text-white font-semibold text-left">
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4" />
                                            <span>Site</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-white font-semibold text-left">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-white font-semibold text-left">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Reason</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-white font-semibold text-left">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Requested Time</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-white font-semibold text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            #{request.id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {request.site_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(request.request_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {request.reason}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(request.requested_time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                <span>{request.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {requests.length === 0 && !error && (
                    <div className="text-center py-12">
                        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                        <p className="text-gray-500">You haven't made any key requests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestHistory;