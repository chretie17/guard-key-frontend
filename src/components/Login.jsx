import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Api from '../api';
import styled, { keyframes } from 'styled-components';

// Import your background image - make sure this path is correct
// You can also use a direct URL for testing
const bgImage = 'https://eu-images.contentstack.com/v3/assets/blta47798dd33129a0c/blt57095e5410d0004d/66d2289a9ba2225a48cb2b5b/782215-2209.jpg';

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
`;

const fadeIn = keyframes`
    from { 
        opacity: 0;
        transform: translateY(20px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
`;

const LoginContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 20px;
    position: relative;
    
    &::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url(${bgImage});
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        filter: brightness(0.7);
        z-index: -2;
    }

    &::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            rgba(225, 58, 68, 0.8) 0%,
            rgba(0, 0, 0, 0.8) 100%
        );
        z-index: -1;
    }
`;

const GlowingOrb = styled.div`
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(225, 58, 68, 0.2) 0%, transparent 70%);
    filter: blur(40px);
    animation: ${float} 6s infinite ease-in-out;
    
    &:nth-child(1) { top: 10%; left: 15%; }
    &:nth-child(2) { bottom: 20%; right: 15%; animation-delay: -3s; }
`;

const LoginBox = styled.div`
    width: 100%;
    max-width: 450px;
    padding: 3rem;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    position: relative;
    z-index: 1;
    animation: ${fadeIn} 0.8s ease-out;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 4px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(225, 58, 68, 0.8),
            transparent
        );
        animation: ${shimmer} 4s infinite linear;
    }
`;

const LogoContainer = styled.div`
    text-align: center;
    margin-bottom: 2.5rem;
    animation: ${float} 3s infinite ease-in-out;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle at center, rgba(225, 58, 68, 0.2) 0%, transparent 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: blur(20px);
        z-index: -1;
    }
`;

const Logo = styled.h1`
    color: #E13A44;
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: 6px;
    text-shadow: 2px 2px 4px rgba(225, 58, 68, 0.2);
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 1rem;
    margin-top: 0.5rem;
    letter-spacing: 2px;
`;

const InputGroup = styled.div`
    position: relative;
    margin-bottom: 1.5rem;
    animation: ${fadeIn} 0.6s ease-out;
    animation-fill-mode: both;

    &:nth-child(1) { animation-delay: 0.2s; }
    &:nth-child(2) { animation-delay: 0.4s; }
`;

const Input = styled.input`
    width: 100%;
    padding: 1.2rem;
    border: 2px solid transparent;
    border-radius: 12px;
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    color: #333;

    &:focus {
        outline: none;
        border-color: #E13A44;
        background: white;
        box-shadow: 0 0 20px rgba(225, 58, 68, 0.1);
    }

    &::placeholder {
        color: #999;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 1.2rem;
    margin-top: 2rem;
    background: linear-gradient(135deg, #E13A44 0%, #ff464f 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    animation: ${fadeIn} 0.6s ease-out;
    animation-delay: 0.6s;
    animation-fill-mode: both;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        transition: 0.5s;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(225, 58, 68, 0.3);

        &::before {
            left: 100%;
        }
    }

    &:active {
        transform: translateY(0);
    }
`;

const ErrorMessage = styled.div`
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(225, 58, 68, 0.1);
    color: #E13A44;
    font-size: 0.9rem;
    text-align: center;
    animation: ${fadeIn} 0.3s ease-out;
`;

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(Api.getUrl('/login'), { identifier, password });
            const { token, role, userId } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);
            setError(null);

            if (role === 'Admin') navigate('/users');
            else if (role === 'Technician') navigate('/request-access');
            else if (role === 'Outsider') navigate('/request-access');
        } catch (err) {
            console.error('Error during login:', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <LoginContainer>
            <GlowingOrb />
            <GlowingOrb />
            <LoginBox>
                <LogoContainer>
                    <Logo>KTRN</Logo>
                    <Subtitle>Key Management System</Subtitle>
                </LogoContainer>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input
                            type="text"
                            placeholder="Username or Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <Button type="submit">
                        Sign In
                    </Button>
                </form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </LoginBox>
        </LoginContainer>
    );
};

export default Login;