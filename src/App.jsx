import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ManageUsers from './components/ManageUsers';
import ManageSites from './components/ManageSites';
import ViewRequests from './components/ViewRequests';
import Reports from './components/Reports';
import MyRequests from './components/MyRequests';
import RequestAccess from './components/RequestAccess';
import Dashboard from './components/Dashboard';
import styled from 'styled-components';
import AdminManageRequests from './components/Adminrequests';
import PublicRequest from './components/publicrequest';
import AdminOutsiderRequests from './components/AdminOutsiderRequest';

const AppContainer = styled.div`
    display: flex;
    width: 100%;
`;

const ContentContainer = styled.div`
    flex: 1;
    padding: 20px;
`;

const AppContent = () => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    return (
        <AppContainer>
{isLoggedIn && location.pathname !== '/login' && location.pathname !== '/publicrequest' && <Sidebar />}
<ContentContainer>
                <Routes>
                     <Route path="/dashboard" element={<Dashboard/>} />
                     <Route path="/publicrequest" element={<PublicRequest/>} />
                     <Route path="/adminoutsider" element={<AdminOutsiderRequests />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/sites" element={<ManageSites />} />
                    <Route path="/requests" element={<ViewRequests />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/my-requests" element={<MyRequests />} />
                    <Route path="/admin-request" element={<AdminManageRequests />} />
                    <Route path="/request-access" element={<RequestAccess />} /> {/* Public route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </ContentContainer>
        </AppContainer>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
