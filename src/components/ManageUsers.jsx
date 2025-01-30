import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Api from '../api';
import { 
    UserPlus, Edit2, Trash2, X, Search, RefreshCw, 
    Mail, User, Lock, UserCog, AlertCircle, CheckCircle, Phone 
} from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [form, setForm] = useState({ 
        id: null, 
        username: '', 
        email: '', 
        password: '', 
        role: 'User',
        phone: '' // Added phone field
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    // Phone number validation
    const validatePhone = (phone) => {
        const phoneRegex = /^(\+250|07)\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(Api.getUrl('/users'));
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(() => {
            setRefreshKey(old => old + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchUsers, refreshKey]);

    useEffect(() => {
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone && user.phone.includes(searchTerm)) // Added phone search
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showSuccess = (message) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate phone number
        if (form.phone && !validatePhone(form.phone)) {
            setError('Please enter a valid Rwandan phone number (+250 or 07 format)');
            return;
        }

        setIsLoading(true);
        
        try {
            if (form.id) {
                await axios.put(Api.getUrl(`/users/${form.id}`), {
                    email: form.email,
                    username: form.username,
                    role: form.role,
                    phone: form.phone // Added phone
                });
                showSuccess('User updated successfully!');
            } else {
                await axios.post(Api.getUrl('/users'), {
                    email: form.email,
                    username: form.username,
                    password: form.password,
                    role: form.role,
                    phone: form.phone // Added phone
                });
                showSuccess('User added successfully!');
            }

            setForm({ id: null, username: '', email: '', password: '', role: 'User', phone: '' });
            setError(null);
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user.');
        } finally {
            setIsLoading(false);
        }
    };

    const editUser = (user) => {
        setForm({ ...user, password: '' });
        setIsModalOpen(true);
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        setIsLoading(true);
        try {
            await axios.delete(Api.getUrl(`/users/${userId}`));
            showSuccess('User deleted successfully!');
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm({ id: null, username: '', email: '', password: '', role: 'User', phone: '' });
        setError(null);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-red-500';
            case 'Technician': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col items-center mb-8">
                            <h1 className="text-3xl font-bold text-[#E13A44] mb-2">
                                Manage Users
                            </h1>
                            <p className="text-gray-500">
                                Total Users: {users.length}
                            </p>
                        </div>

                        {/* Notifications */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={fetchUsers}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-[#E13A44]/20"
                                >
                                    <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E13A44] text-white rounded-xl hover:bg-[#E13A44]/90 focus:ring-2 focus:ring-[#E13A44]/20"
                                >
                                    <UserPlus className="h-5 w-5" />
                                    Add User
                                </button>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-[#E13A44]/10 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-[#E13A44]" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Phone className="h-4 w-4" />
                                                        <span className="text-sm">{user.phone}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)} text-white`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => editUser(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {form.id ? 'Update User' : 'Add New User'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="username"
                                            required
                                            value={form.username}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                            placeholder="Enter email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                            placeholder="Enter phone number (+250 or 07...)"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Format: +250xxxxxxxxx or 07xxxxxxxx</p>
                                    </div>
                                </div>

                                {!form.id && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                value={form.password}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44]"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E13A44]/20 focus:border-[#E13A44] appearance-none bg-white"
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Technician">Technician</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-[#E13A44] text-white rounded-xl hover:bg-[#E13A44]/90 focus:ring-2 focus:ring-[#E13A44]/20 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-colors"
                                    >
                                        {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                                        {form.id ? 'Update' : 'Add'} User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <User className="h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                        <p className="text-gray-500 max-w-sm">
                            No users match your current search criteria. Try adjusting your search or add a new user.
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-[#E13A44] hover:text-[#E13A44]/90 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;