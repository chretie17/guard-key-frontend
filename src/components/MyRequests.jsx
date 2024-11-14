import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Title = styled.h2`
    text-align: center;
    color: #E13A44;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
`;

const TableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #E13A44;
    color: #fff;
    text-align: left;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
`;

const Status = styled.span`
    padding: 5px 10px;
    border-radius: 5px;
    background-color: ${props => props.status === 'Approved' ? '#4CAF50' : props.status === 'Denied' ? '#ff4c4c' : '#E13A44'};
    color: #fff;
`;

const RequestHistory = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

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

    return (
        <Container>
            <Title>Your Key Request History</Title>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Site</TableHeader>
                        <TableHeader>Date</TableHeader>
                        <TableHeader>Reason</TableHeader>
                        <TableHeader>Requested Time</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id}>
                            <TableData>{request.id}</TableData>
                            <TableData>{request.site_name}</TableData>
                            <TableData>{new Date(request.request_date).toLocaleDateString()}</TableData>
                            <TableData>{request.reason}</TableData>
                            <TableData>{new Date(request.requested_time).toLocaleString()}</TableData>
                            <TableData><Status status={request.status}>{request.status}</Status></TableData>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default RequestHistory;
