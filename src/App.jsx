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

const SidebarContainer = styled.div`
    width: 250px; /* Fixed width */
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh; /* Full height */
    background-color: #1e293b; /* Dark blue-gray */
    color: white;
    z-index: 1000;
`;

const ContentContainer = styled.div`
    flex: 1;
    padding: 20px;
    ${({ isAuthenticated }) => isAuthenticated && `margin-left: 250px; width: calc(100% - 250px);`}
`;

const AppContent = () => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    // Define pages that should NOT have the sidebar
    const noSidebarPages = ['/login', '/publicrequest'];
    const isAuthenticated = isLoggedIn && !noSidebarPages.includes(location.pathname);

    return (
        <AppContainer>
            {/* Only show Sidebar for authenticated pages */}
            {isAuthenticated && (
                <SidebarContainer>
                    <Sidebar />
                </SidebarContainer>
            )}
            <ContentContainer isAuthenticated={isAuthenticated}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/publicrequest" element={<PublicRequest />} />
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
