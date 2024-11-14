import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';
import Modal from 'react-modal';

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    text-align: center;
    color: #E13A44;
    font-weight: bold;
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
    color: #333;
`;

const Button = styled.button`
    padding: 10px;
    background-color: ${props => props.delete ? '#ff4c4c' : '#E13A44'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    margin-right: 5px;

    &:hover {
        background-color: ${props => props.delete ? '#ff3333' : '#c73238'};
    }
`;

const AddUserButton = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
    display: block;
    margin-left: auto;

    &:hover {
        background-color: #45a049;
    }
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

Modal.setAppElement('#root');

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ id: null, username: '', email: '', password: '', role: 'User' });
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(Api.getUrl('/users'));
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or update a user
  // Add or update a user
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || (!form.id && !form.password)) {
        setError('Username, Email, and Password (for new users) are required.');
        return;
    }

    try {
        if (form.id) {
            // Update user without changing password
            await axios.put(Api.getUrl(`/users/${form.id}`), {
                email: form.email,
                username: form.username,
                role: form.role
            });
            // Update users state to reflect changes
            setUsers(users.map(user => user.id === form.id ? { ...user, email: form.email, username: form.username, role: form.role } : user));
        } else {
            // Add new user with password
            const response = await axios.post(Api.getUrl('/users'), {
                email: form.email,
                username: form.username,
                password: form.password,
                role: form.role
            });
            // Fetch updated users list or append new user directly
            setUsers([...users, response.data]);
        }

        // Reset form after submission
        setForm({ id: null, username: '', email: '', password: '', role: 'User' });
        setError(null);
        setIsModalOpen(false);
    } catch (err) {
        setError('Failed to save user.');
        console.error(err);
    }
};

    // Edit a user
    const editUser = (user) => {
        setForm({ ...user, password: '' }); // Don't set password in form for updates
        setIsModalOpen(true);
    };

    // Delete a user
    const deleteUser = async (userId) => {
        try {
            await axios.delete(Api.getUrl(`/users/${userId}`));
            setUsers(users.filter(user => user.id !== userId)); // Update UI after deletion
        } catch (err) {
            setError('Failed to delete user.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Title>Manage Users</Title>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <AddUserButton onClick={() => setIsModalOpen(true)}>Add User</AddUserButton>

            {/* Users Table */}
            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Username</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Role</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <TableData>{user.id}</TableData>
                            <TableData>{user.username}</TableData>
                            <TableData>{user.email}</TableData>
                            <TableData>{user.role}</TableData>
                            <TableData>
                                <Button onClick={() => editUser(user)}>Edit</Button>
                                <Button delete onClick={() => deleteUser(user.id)}>Delete</Button>
                            </TableData>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add / Edit User Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="User Form"
                style={{
                    content: {
                        maxWidth: '500px',
                        margin: 'auto',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <ModalContent>
                    <h2>{form.id ? 'Update User' : 'Add User'}</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        {!form.id && (
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <Select name="role" value={form.role} onChange={handleChange}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Technician">Technician</option>
                        </Select>
                        <Button type="submit">{form.id ? 'Update User' : 'Add User'}</Button>
                    </form>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ManageUsers;
