import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    width: 95%;
    max-width: 1100px;
    margin: 20px auto;
    background-color: #fff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
`;

const Title = styled.h2`
    text-align: center;
    color: #F1404A;
    font-weight: 800;
    font-size: 2em;
    margin-bottom: 30px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
`;

const TableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #F1404A;
    color: #fff;
    text-align: left;
    font-size: 1em;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    font-size: 0.9em;
    background-color: #f9f9f9;
`;

const Status = styled.span`
    padding: 5px 10px;
    border-radius: 20px;
    background-color: ${props =>
        props.status === 'Approved' ? '#4CAF50' :
        props.status === 'Denied' ? '#ff4c4c' : '#E13A44'};
    color: #fff;
    font-weight: 700;
`;

const Button = styled.button`
    padding: 8px 12px;
    margin: 0 5px;
    background-color: ${props => props.color};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: background-color 0.3s;
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
            <Title>Manage Partners Key Requests</Title>
            {error && <p style={{ color: '#ff4c4c', textAlign: 'center', fontWeight: '700' }}>{error}</p>}
            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Phone</TableHeader>
                        <TableHeader>Site Name</TableHeader>
                        <TableHeader>Partner</TableHeader>
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
                            <TableData>{request.email}</TableData>
                            <TableData>{request.phone}</TableData>
                            <TableData>{request.site_name}</TableData>
                            <TableData>{request.partner_name}</TableData>
                            <TableData>{new Date(request.requested_time).toLocaleString()}</TableData>
                            <TableData>{request.reason}</TableData>
                            <TableData>
                                <Status status={request.status}>{request.status}</Status>
                            </TableData>
                            <TableData>
                                <Button color="#4CAF50" hoverColor="#45a049" onClick={() => updateRequestStatus(request.id, 'Approved')}>
                                    Approve
                                </Button>
                                <Button color="#ff4c4c" hoverColor="#ff3333" onClick={() => updateRequestStatus(request.id, 'Denied')}>
                                    Deny
                                </Button>
                                <Button color="#E13A44" hoverColor="#c73238" onClick={() => updateRequestStatus(request.id, 'Returned')}>
                                    Return
                                </Button>
                            </TableData>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminOutsiderRequests;
