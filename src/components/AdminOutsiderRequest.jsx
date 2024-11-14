import React, { useEffect, useState } from 'react';
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
    color: #333;
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
    background-color: #333;
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

const Button = styled.button`
    padding: 8px;
    margin: 0 5px;
    background-color: ${props => props.color};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: ${props => props.hoverColor};
    }
`;

const AdminOutsiderRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(Api.getUrl('/admin/outsider-requests'));
                setRequests(response.data);
            } catch (err) {
                setError('Failed to fetch outsider requests.');
                console.error(err);
            }
        };
        fetchRequests();
    }, []);

    const updateRequestStatus = async (id, status) => {
        try {
            await axios.put(Api.getUrl(`/admin/outsider-requests/${id}/status`), { status });
            setRequests(requests.map(req => (req.id === id ? { ...req, status } : req)));
        } catch (err) {
            setError('Failed to update request status.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Title>Manage Outsider Key Requests</Title>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Site Name</TableHeader>
                        <TableHeader>Requested Time</TableHeader>
                        <TableHeader>Reason</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id}>
                            <TableData>{request.id}</TableData>
                            <TableData>{request.name}</TableData>
                            <TableData>{request.site_name}</TableData>
                            <TableData>{new Date(request.requested_time).toLocaleString()}</TableData>
                            <TableData>{request.reason}</TableData>
                            <TableData><Status status={request.status}>{request.status}</Status></TableData>
                            <TableData>
                                <Button color="#4CAF50" hoverColor="#45a049" onClick={() => updateRequestStatus(request.id, 'Approved')}>Approve</Button>
                                <Button color="#ff4c4c" hoverColor="#ff3333" onClick={() => updateRequestStatus(request.id, 'Denied')}>Deny</Button>
                                <Button color="#E13A44" hoverColor="#c73238" onClick={() => updateRequestStatus(request.id, 'Returned')}>Return</Button>
                            </TableData>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminOutsiderRequests;
