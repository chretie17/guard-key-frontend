import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
    width: 280px;
    padding: 0;
    background: linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(135deg, #E13A44 0%, #FF464F 100%);
        clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
        z-index: 1;
    }
`;

const BrandingSection = styled.div`
    padding: 2rem;
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 1rem;
`;

const Logo = styled.h1`
    color: white;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: 4px;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.div`
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    margin-top: 0.5rem;
    letter-spacing: 1px;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 2rem;
    margin: 0;
    position: relative;
    z-index: 2;
    flex: 1;
`;

const MenuItem = styled.li`
    margin-bottom: 0.75rem;
    transform: translateX(0);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateX(5px);
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #2D3748;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    display: block;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
        color: #E13A44;
        background: white;
        box-shadow: 0 4px 15px rgba(225, 58, 68, 0.1);
    }

    &::before {
        content: '→';
        margin-right: 0.75rem;
        opacity: 0;
        transform: translateX(-10px);
        display: inline-block;
        transition: all 0.2s ease;
    }

    &:hover::before {
        opacity: 1;
        transform: translateX(0);
    }
`;

const LogoutButton = styled.button`
    margin: 2rem;
    padding: 1rem;
    background: #E13A44;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    z-index: 2;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(225, 58, 68, 0.2);
        background: #ff464f;
    }

    &:hover::after {
        opacity: 1;
    }

    &:active {
        transform: translateY(0);
    }
`;

const Sidebar = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <SidebarContainer>
            <BrandingSection>
                <Logo>KTRN</Logo>
                <Subtitle>Key Management System</Subtitle>
            </BrandingSection>
            <MenuList>
                {role === 'Admin' && (
                    <>
                        <MenuItem><StyledLink to="/users">Manage Users</StyledLink></MenuItem>
                        <MenuItem><StyledLink to="/sites">Manage Sites</StyledLink></MenuItem>
                        <MenuItem><StyledLink to="/admin-request">View Requests</StyledLink></MenuItem>
                        <MenuItem><StyledLink to="/reports">Reports</StyledLink></MenuItem>
                    </>
                )}
                
                {role === 'Technician' && (
                    <>
                        <MenuItem><StyledLink to="/request-access">Request Access</StyledLink></MenuItem>
                        <MenuItem><StyledLink to="/my-requests">My Requests</StyledLink></MenuItem>
                    </>
                )}
                
                {role === 'Outsider' && (
                    <>
                        <MenuItem><StyledLink to="/request-access">Request Access</StyledLink></MenuItem>
                    </>
                )}
            </MenuList>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </SidebarContainer>
    );
};

export default Sidebar;