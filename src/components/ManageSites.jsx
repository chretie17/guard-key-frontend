import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: auto;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    text-align: center;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

const TableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f4f4f4;
    text-align: left;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Select = styled.select`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: ${props => props.delete ? '#ff4c4c' : '#4CAF50'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;

    &:hover {
        background-color: ${props => props.delete ? '#ff3333' : '#45a049'};
    }
`;

const ManageSites = () => {
    const [sites, setSites] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', location: '', status: 'Active' });
    const [error, setError] = useState(null);

    // Fetch sites from backend
    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/sites'));
                setSites(response.data);
            } catch (err) {
                setError('Failed to fetch sites.');
                console.error(err);
            }
        };

        fetchSites();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or update a site
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (form.id) {
                // Update site
                response = await axios.put(Api.getUrl(`/sites/${form.id}`), form);
                setSites(sites.map(site => (site.id === form.id ? response.data : site)));
            } else {
                // Add new site
                response = await axios.post(Api.getUrl('/sites'), form);
                setSites([...sites, response.data]);
            }
            // Reset form after submission
            setForm({ id: null, name: '', location: '', status: 'Active' });
            setError(null);
        } catch (err) {
            setError('Failed to save site.');
            console.error(err);
        }
    };

    // Edit a site
    const editSite = (site) => setForm(site);

    // Delete a site
    const deleteSite = async (siteId) => {
        try {
            await axios.delete(Api.getUrl(`/sites/${siteId}`));
            setSites(sites.filter(site => site.id !== siteId));
        } catch (err) {
            setError('Failed to delete site.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Title>Manage Sites</Title>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Add / Edit Site Form */}
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Site Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />
                <Select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                </Select>
                <Button type="submit">{form.id ? 'Update Site' : 'Add Site'}</Button>
            </Form>

            {/* Sites Table */}
            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Location</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {sites.map(site => (
                        <tr key={site.id}>
                            <TableData>{site.id}</TableData>
                            <TableData>{site.name}</TableData>
                            <TableData>{site.location}</TableData>
                            <TableData>{site.status}</TableData>
                            <TableData>
                                <Button onClick={() => editSite(site)}>Edit</Button>
                                <Button delete onClick={() => deleteSite(site.id)}>Delete</Button>
                            </TableData>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageSites;
