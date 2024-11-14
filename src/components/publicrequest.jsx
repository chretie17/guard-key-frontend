import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    font-size: 16px;
`;

const TextArea = styled.textarea`
    margin: 10px 0;
    padding: 10px;
    font-size: 16px;
    resize: none;
`;

const Select = styled.select`
    margin: 10px 0;
    padding: 10px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    &:hover {
        background-color: #45a049;
    }
`;

const OutsiderRequestForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', site_id: '', reason: '', requested_time: '' });
    const [sites, setSites] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/public/active-sites'));
                setSites(response.data);
            } catch (error) {
                console.error("Error fetching active sites:", error);
            }
        };
        fetchSites();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting request:", formData); // Log request data
            const response = await axios.post(Api.getUrl('/public/requests'), formData);
            setMessage(response.data.message);
            setFormData({ name: '', email: '', phone: '', site_id: '', reason: '', requested_time: '' });
        } catch (error) {
            if (error.response) {
                console.error("Error response data:", error.response.data); // Log server error response
                setMessage(error.response.data.error || "Error submitting request.");
            } else {
                console.error("Request error:", error);
                setMessage("Error submitting request.");
            }
        }
    };
    
    return (
        <Container>
            <Title>Outsider Key Request</Title>
            {message && <p>{message}</p>}
            <Form onSubmit={handleSubmit}>
                <Input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                <Input type="text" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} />
                
                <Select name="site_id" value={formData.site_id} onChange={handleChange} required>
                    <option value="">Select Site</option>
                    {sites.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                </Select>

                <TextArea name="reason" placeholder="Reason for Request" value={formData.reason} onChange={handleChange} required />
                <Input type="datetime-local" name="requested_time" value={formData.requested_time} onChange={handleChange} required />
                <Button type="submit">Submit Request</Button>
            </Form>
        </Container>
    );
};

export default OutsiderRequestForm;
