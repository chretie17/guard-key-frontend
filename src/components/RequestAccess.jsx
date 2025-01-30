import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import { Key, Clock, Building, FileText, Check } from "lucide-react";

const RequestKey = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [reason, setReason] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/sites'));
                setSites(response.data);
            } catch (error) {
                console.error("Error fetching sites:", error);
            }
        };
        fetchSites();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(Api.getUrl('/requests'), {
                user_id: userId,
                site_id: selectedSite,
                reason,
                requested_time: requestedTime
            });
            setMessage("Key request submitted successfully!");
            setReason('');
            setRequestedTime('');
            setSelectedSite('');
            
            // Show success message for 3 seconds
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error("Error submitting key request:", error);
            setMessage(error.response?.data?.error || "Failed to submit key request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative overflow-hidden flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-90" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjA0LCA2MSwgNTMsIDAuMikiLz48L2c+PC9zdmc+')] opacity-40" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card with premium shadow and border */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
                    {/* Gradient Header with Icon */}
                    <div className="bg-gradient-to-r from-[#CC3D35] to-[#E54B43] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12" />
                        
                        <div className="relative flex flex-col items-center">
                            <div className="p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                                <Key className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-center">Request Key</h1>
                        </div>
                    </div>
                    
                    {/* Form Content */}
                    <div className="p-8 space-y-6">
                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-2 ${
                                message.includes("success") 
                                    ? "bg-green-50 text-green-700 border border-green-100" 
                                    : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                                {message.includes("success") ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <div className="h-5 w-5 text-red-500">⚠️</div>
                                )}
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Site Selection */}
                            <div className="relative group">
                                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400 
                                                   transition-colors group-focus-within:text-[#CC3D35]" />
                                <select
                                    value={selectedSite}
                                    onChange={(e) => setSelectedSite(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                             focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent
                                             outline-none bg-white transition-all duration-200
                                             hover:border-gray-300"
                                >
                                    <option value="">Select Site</option>
                                    {sites.map(site => (
                                        <option key={site.id} value={site.id}>{site.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Reason Textarea */}
                            <div className="relative group">
                                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 
                                                   transition-colors group-focus-within:text-[#CC3D35]" />
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Reason for request"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                             focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent
                                             outline-none min-h-[120px] resize-none transition-all
                                             duration-200 hover:border-gray-300"
                                />
                            </div>
                            
                            {/* DateTime Input */}
                            <div className="relative group">
                                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 
                                                transition-colors group-focus-within:text-[#CC3D35]" />
                                <input
                                    type="datetime-local"
                                    value={requestedTime}
                                    onChange={(e) => setRequestedTime(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                                             focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent
                                             outline-none transition-all duration-200
                                             hover:border-gray-300"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#CC3D35] to-[#E54B43] 
                                         text-white py-3 px-4 rounded-xl font-medium 
                                         hover:from-[#B02E27] hover:to-[#CC3D35] 
                                         transition-all duration-200
                                         focus:ring-2 focus:ring-offset-2 focus:ring-[#CC3D35]
                                         disabled:opacity-70 disabled:cursor-not-allowed
                                         relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                              translate-x-[-100%] group-hover:translate-x-[100%] 
                                              transition-transform duration-1000" />
                                <span className="relative">
                                    {isSubmitting ? 'Submitting...' : 'Request Key'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestKey;