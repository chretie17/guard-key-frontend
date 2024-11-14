import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    max-width: 500px;
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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Select = styled.select`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Textarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    resize: vertical;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #45a049;
    }
`;

const RequestKey = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [reason, setReason] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

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
        <Container>
            <Title>Request Key</Title>
            {message && <p>{message}</p>}
            <Form onSubmit={handleSubmit}>
                <Select value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)} required>
                    <option value="">Select Site</option>
                    {sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                </Select>
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for request"
                    required
                />
                <Input
                    type="datetime-local"
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    required
                />
                <Button type="submit">Request Key</Button>
            </Form>
        </Container>
    );
};

export default RequestKey;
