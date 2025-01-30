import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle, Building2, User } from "lucide-react";
import api from "../api";
import axios from "axios";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    bestPerformingSite: { site_name: "", total_requests: 0 },
    mostActiveUser: { username: "", total_requests: 0 },
    requestDistribution: [],
    statusBreakdown: [],
    popularRequestTime: { request_hour: 0, total_requests: 0 },
    requestTrends: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        totalRequestsRes,
        approvedRequestsRes,
        bestPerformingSiteRes,
        mostActiveUserRes,
        requestDistributionRes,
        statusBreakdownRes,
        popularRequestTimeRes,
        requestTrendsRes,
      ] = await Promise.all([
        axios.get(api.getUrl("/dashboard/total-requests")),
        axios.get(api.getUrl("/dashboard/approved-requests")),
        axios.get(api.getUrl("/dashboard/best-performing-site")),
        axios.get(api.getUrl("/dashboard/most-active-user")),
        axios.get(api.getUrl("/dashboard/request-distribution")),
        axios.get(api.getUrl("/dashboard/status-breakdown")),
        axios.get(api.getUrl("/dashboard/popular-request-time")),
        axios.get(api.getUrl("/dashboard/request-trends")),
      ]);

      setDashboardData({
        totalRequests: totalRequestsRes.data.total_requests,
        approvedRequests: approvedRequestsRes.data.approved_requests,
        bestPerformingSite: bestPerformingSiteRes.data,
        mostActiveUser: mostActiveUserRes.data,
        requestDistribution: requestDistributionRes.data,
        statusBreakdown: statusBreakdownRes.data,
        popularRequestTime: popularRequestTimeRes.data,
        requestTrends: requestTrendsRes.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const {
    totalRequests,
    approvedRequests,
    bestPerformingSite,
    mostActiveUser,
    requestDistribution,
    statusBreakdown,
    popularRequestTime,
    requestTrends,
  } = dashboardData;

  // Calculate approval rate
  const approvalRate = ((approvedRequests / totalRequests) * 100).toFixed(1);
  const isPositiveGrowth = approvalRate > 50;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value.toLocaleString()} requests
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                isPositiveGrowth ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {isPositiveGrowth ? (
                  <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +{approvalRate}%
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    {approvalRate}%
                  </div>
                )}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Total Requests</p>
          </div>

          {/* Approved Requests Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{approvedRequests.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Approved Requests</p>
          </div>

          {/* Best Performing Site Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 truncate">
              {bestPerformingSite.site_name || "N/A"}
            </h3>
            <p className="text-gray-600 text-sm">
              {bestPerformingSite.total_requests?.toLocaleString() || 0} requests
            </p>
          </div>

          {/* Most Active User Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 truncate">
              {mostActiveUser.username || "N/A"}
            </h3>
            <p className="text-gray-600 text-sm">
              {mostActiveUser.total_requests?.toLocaleString() || 0} requests
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Requests by Site</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestDistribution} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="site_name" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{fontSize: 12}}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_requests" 
                    fill="#F3414B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusBreakdown} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total_requests" 
                    fill="#F3414B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hourly Request Pattern</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[popularRequestTime]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="request_hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="total_requests" 
                    fill="#f59e0b" 
                    fillOpacity={0.2}
                    stroke="#f59e0b"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={requestTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="request_date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{fontSize: 12}}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="total_requests" 
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}