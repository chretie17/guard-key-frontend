import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import { Key, Clock, Building, FileText } from "lucide-react";

const RequestKey = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [reason, setReason] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [message, setMessage] = useState('');
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
        } catch (error) {
            console.error("Error submitting key request:", error);
            setMessage(error.response?.data?.error || "Failed to submit key request.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#CC3D35] to-[#E54B43] p-6 text-white">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <Key className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center">Request Key</h1>
                </div>
                
                <div className="p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg ${
                            message.includes("success") 
                                ? "bg-green-50 text-green-700" 
                                : "bg-red-50 text-red-700"
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedSite}
                                onChange={(e) => setSelectedSite(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent outline-none bg-white"
                            >
                                <option value="">Select Site</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>{site.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason for request"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent outline-none min-h-[100px] resize-none"
                            />
                        </div>
                        
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="datetime-local"
                                value={requestedTime}
                                onChange={(e) => setRequestedTime(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CC3D35] focus:border-transparent outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#CC3D35] text-white py-2 px-4 rounded-lg font-medium 
                                hover:bg-[#B02E27] transition-colors duration-200 
                                focus:ring-2 focus:ring-offset-2 focus:ring-[#CC3D35]"
                        >
                            Request Key
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestKey;