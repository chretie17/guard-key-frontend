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
} from "recharts";
import styled from "styled-components";
import api from "../api"; // Your Api class with getUrl method
import axios from "axios"; // Axios for HTTP requests

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

  return (
    <DashboardContainer>
      <CardRow>
        <Card>
          <CardTitle>Total Requests</CardTitle>
          <CardValue>{totalRequests}</CardValue>
          <CardDescription>Total number of requests made</CardDescription>
        </Card>
        <Card>
          <CardTitle>Approved Requests</CardTitle>
          <CardValue>{approvedRequests}</CardValue>
          <CardDescription>Total approved key requests</CardDescription>
        </Card>
        <Card>
          <CardTitle>Best Performing Site</CardTitle>
          <CardValue>{bestPerformingSite.site_name || "N/A"}</CardValue>
          <CardDescription>
            Requests: {bestPerformingSite.total_requests || 0}
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>Most Active User</CardTitle>
          <CardValue>{mostActiveUser.username || "N/A"}</CardValue>
          <CardDescription>
            Requests: {mostActiveUser.total_requests || 0}
          </CardDescription>
        </Card>
      </CardRow>

      <ChartsContainer>
        <ChartWrapper>
          <ChartTitle>Requests by Site</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="site_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_requests" fill="#4CAF50" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Status Breakdown</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_requests" fill="#FF9800" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartsContainer>

      <ChartsContainer>
        <ChartWrapper>
          <ChartTitle>Requests by Hour</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[popularRequestTime]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="request_hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_requests" fill="#FFC107" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Request Trends Over Time</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="request_date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total_requests" stroke="#673AB7" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartsContainer>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #fffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
`;

const CardValue = styled.h2`
  color: #FB454E;
  font-size: 2rem;
  font-weight: bold;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const ChartWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ChartTitle = styled.h4`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;
