import React, { useEffect, useState } from "react";
import Api from "../api";
import styled from "styled-components";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    TextField,
    Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Styled Components
const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: auto;
    font-family: "Inter", sans-serif;
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
`;

const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const StatCard = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 15px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Card = styled.div`
    flex: 1;
    padding: 15px;
    background-color: #f8f9fa;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
`;

const Label = styled.h3`
    color: #cc3d35;
    font-size: 18px;
`;

const Value = styled.p`
    color: #333;
    font-size: 24px;
    font-weight: bold;
`;

const TableContainer = styled(Paper)`
    margin-top: 20px;
    overflow: auto;
`;

const SectionTitle = styled.h3`
    color: #333;
    margin: 20px 0 10px;
`;

const UserTypeBadge = ({ userType }) => {
    const color = userType === "Outsider" ? "#1976d2" : "#9c27b0";
    return <span style={{ color }}>{userType}</span>;
};

// Report Component
const Report = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchReport = async (start, end) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = start && end ? `?startDate=${start}&endDate=${end}` : "";
            const response = await fetch(Api.getUrl(`/report${queryParams}`));
            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }
            const data = await response.json();
            setReportData(data);
        } catch (err) {
            setError("Error fetching report data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSubmit = () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }
        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");
        fetchReport(formattedStartDate, formattedEndDate);
    };

    useEffect(() => {
        fetchReport(); // Fetch overall report initially
    }, []);

    if (loading) {
        return (
            <Container>
                <Title>Generating Report...</Title>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Title>{error}</Title>
            </Container>
        );
    }

    return (
        <Container>
            <Title>Key Request Report</Title>

            {/* Date Range Filter */}
            <FilterContainer>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button variant="contained" color="primary" onClick={handleDateSubmit}>
                    Apply Date Range
                </Button>
            </FilterContainer>

            {/* Overview Cards */}
            <StatCard>
                <Card>
                    <Label>Total Requests</Label>
                    <Value>{reportData?.totalRequests}</Value>
                </Card>
                <Card>
                    <Label>Approved Requests</Label>
                    <Value>{reportData?.approvedRequests}</Value>
                </Card>
                <Card>
                    <Label>Best Performing Site</Label>
                    <Value>{reportData?.bestPerformingSite?.site_name || "No data"}</Value>
                </Card>
                <Card>
                    <Label>Best Partner</Label>
                    <Value>{reportData?.bestPartner?.partner_name || "No data"}</Value>
                </Card>
            </StatCard>

            {/* Request Distribution */}
            <SectionTitle>Request Distribution by Site</SectionTitle>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Site Name</TableCell>
                            <TableCell>Total Requests</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData?.requestDistribution?.map((site) => (
                            <TableRow key={site.site_name}>
                                <TableCell>{site.site_name}</TableCell>
                                <TableCell>{site.total_requests}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Status Breakdown */}
            <SectionTitle>Status Breakdown</SectionTitle>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Requests</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData?.statusBreakdown?.map((status) => (
                            <TableRow key={status.status}>
                                <TableCell>{status.status}</TableCell>
                                <TableCell>{status.total_requests}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details */}
            <SectionTitle>Users Who Requested Keys</SectionTitle>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User Type</TableCell>
                            <TableCell>Request ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Site Name</TableCell>
                            <TableCell>Partner Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Requested Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportData?.userDetails?.map((user) => (
                            <TableRow key={user.request_id}>
                                <TableCell><UserTypeBadge userType={user.user_type} /></TableCell>
                                <TableCell>{user.request_id}</TableCell>
                                <TableCell>{user.requester_name}</TableCell>
                                <TableCell>{user.requester_email}</TableCell>
                                <TableCell>{user.requester_phone || "N/A"}</TableCell>
                                <TableCell>{user.site_name}</TableCell>
                                <TableCell>{user.partner_name || "N/A"}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{new Date(user.requested_time).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Report;
