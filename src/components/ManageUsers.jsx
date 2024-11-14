import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f9f9f9;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

const Title = styled.h1`
  margin-bottom: 40px;
  text-align: center;
  color: #e13a44;
  font-weight: bold;
  font-size: 36px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #e13a44;
  color: #fff;
  text-align: left;
  font-weight: bold;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 20px;
  text-align: left;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background-color: ${props => props.delete ? '#ff4c4c' : '#e13a44'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-right: 12px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.delete ? '#ff3333' : '#c73238'};
  }
`;

const AddUserButton = styled.button`
  padding: 14px 28px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 40px;
  display: block;
  margin-left: auto;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

Modal.setAppElement('#root');
const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ id: null, username: '', email: '', password: '', role: 'User' });
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.email || (!form.id && !form.password)) {
            setError('Username, Email, and Password (for new users) are required.');
            return;
        }

        try {
            if (form.id) {
                await axios.put(Api.getUrl(`/users/${form.id}`), {
                    email: form.email,
                    username: form.username,
                    role: form.role
                });
                setUsers(users.map(user => user.id === form.id ? { ...user, email: form.email, username: form.username, role: form.role } : user));
            } else {
                const response = await axios.post(Api.getUrl('/users'), {
                    email: form.email,
                    username: form.username,
                    password: form.password,
                    role: form.role
                });
                setUsers([...users, response.data]);
            }

            setForm({ id: null, username: '', email: '', password: '', role: 'User' });
            setError(null);
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to save user.');
            console.error(err);
        }
    };

    const editUser = (user) => {
        setForm({ ...user, password: '' });
        setIsModalOpen(true);
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(Api.getUrl(`/users/${userId}`));
            setUsers(users.filter(user => user.id !== userId));
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