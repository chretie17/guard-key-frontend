import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, Mail, Phone, User, Lock } from 'lucide-react';
import Logo from '../assets/logo.jpeg';

// Enhanced Styled Components with modern design
const PageWrapper = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
`;

const GlassContainer = styled(motion.div)`
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    padding: 3rem;
    width: 100%;
    max-width: 680px;
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.08),
        0 10px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.7);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #CC3D35 0%, #E53E3E 100%);
    }
`;

const LogoWrapper = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;

    img {
        width: 140px;
        height: auto;
        margin-bottom: 1.5rem;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }
`;

const Title = styled(motion.h1)`
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #CC3D35 0%, #E53E3E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    margin: 0;
    padding: 0;
`;

const Subtitle = styled(motion.p)`
    text-align: center;
    color: #64748b;
    margin: 1.25rem 0 2.5rem;
    font-size: 1.15rem;
    line-height: 1.6;
    font-weight: 400;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InputWrapper = styled(motion.div)`
    position: relative;
    grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const InputIcon = styled.div`
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #CC3D35;
    opacity: 0.8;
    z-index: 2;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 1.15rem 1.25rem 1.15rem 3.25rem;
    background: #ffffff;
    border: 2px solid rgba(203, 213, 224, 0.4);
    border-radius: 14px;
    font-size: 1rem;
    transition: all 0.2s ease;
    outline: none;
    color: #1a1a1a;

    &:hover {
        border-color: rgba(204, 61, 53, 0.4);
    }

    &:focus {
        border-color: #CC3D35;
        box-shadow: 0 0 0 4px rgba(204, 61, 53, 0.1);
    }

    &::placeholder {
        color: #94a3b8;
    }
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 1.15rem 1.25rem 1.15rem 3.25rem;
    background: #ffffff;
    border: 2px solid rgba(203, 213, 224, 0.4);
    border-radius: 14px;
    font-size: 1rem;
    transition: all 0.2s ease;
    outline: none;
    appearance: none;
    cursor: pointer;
    color: #1a1a1a;

    &:hover {
        border-color: rgba(204, 61, 53, 0.4);
    }

    &:focus {
        border-color: #CC3D35;
        box-shadow: 0 0 0 4px rgba(204, 61, 53, 0.1);
    }
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 1.15rem 1.25rem;
    background: #ffffff;
    border: 2px solid rgba(203, 213, 224, 0.4);
    border-radius: 14px;
    font-size: 1rem;
    min-height: 140px;
    transition: all 0.2s ease;
    outline: none;
    resize: vertical;
    color: #1a1a1a;

    &:hover {
        border-color: rgba(204, 61, 53, 0.4);
    }

    &:focus {
        border-color: #CC3D35;
        box-shadow: 0 0 0 4px rgba(204, 61, 53, 0.1);
    }
`;

const SubmitButton = styled(motion.button)`
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, #CC3D35 0%, #E53E3E 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 2.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 8px 16px rgba(204, 61, 53, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 20px rgba(204, 61, 53, 0.25);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
`;

const Message = styled(motion.div)`
    padding: 1.25rem;
    margin: 1.25rem 0;
    border-radius: 14px;
    background: ${props => props.isError ? 
        'rgba(254, 226, 226, 0.95)' : 
        'rgba(236, 253, 245, 0.95)'};
    color: ${props => props.isError ? '#991B1B' : '#065F46'};
    border: 1px solid ${props => props.isError ? 
        'rgba(153, 27, 27, 0.2)' : 
        'rgba(6, 95, 70, 0.2)'};
    backdrop-filter: blur(8px);
    font-weight: 500;
`;

const LoadingSpinner = styled(motion.div)`
    width: 24px;
    height: 24px;
    border: 3px solid #ffffff;
    border-top: 3px solid transparent;
    border-radius: 50%;
    margin: 0 auto;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Animation variants remain the same
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, type: "spring", stiffness: 100 }
    }
};

const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.3 }
    }
};
const OutsiderRequestForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        site_id: '',
        reason: '',
        requested_time: ''
    });
    const [sites, setSites] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/public/active-sites'));
                setSites(response.data);
            } catch (error) {
                console.error("Error fetching active sites:", error);
                setMessage("Error loading sites. Please try again later.");
                setIsError(true);
            }
        };
        fetchSites();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(Api.getUrl('/public/requests'), formData);
            setMessage(response.data.message);
            setIsError(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                site_id: '',
                reason: '',
                requested_time: ''
            });
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.error || "Error submitting request.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper>
            <GlassContainer
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <LogoWrapper
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img src={Logo} alt="Company Logo" />
                    <Title>Outsider Key Request</Title>
                    <Subtitle>Complete the form below to request access</Subtitle>
                </LogoWrapper>

                <AnimatePresence>
                    {message && (
                        <Message
                            isError={isError}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {message}
                        </Message>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <FormGrid>
                        <InputWrapper variants={inputVariants}>
                            <InputIcon>
                                <User size={20} />
                            </InputIcon>
                            <StyledInput
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>

                        <InputWrapper variants={inputVariants}>
                            <InputIcon>
                                <Mail size={20} />
                            </InputIcon>
                            <StyledInput
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>

                        <InputWrapper variants={inputVariants}>
                            <InputIcon>
                                <Phone size={20} />
                            </InputIcon>
                            <StyledInput
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </InputWrapper>

                        <InputWrapper variants={inputVariants}>
                            <InputIcon>
                                <Building2 size={20} />
                            </InputIcon>
                            <StyledSelect
                                name="site_id"
                                value={formData.site_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Site</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>
                                        {site.name}
                                    </option>
                                ))}
                            </StyledSelect>
                        </InputWrapper>

                        <InputWrapper fullWidth variants={inputVariants}>
                            <StyledTextarea
                                name="reason"
                                placeholder="Reason for Request"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>

                        <InputWrapper fullWidth variants={inputVariants}>
                            <InputIcon>
                                <Calendar size={20} />
                            </InputIcon>
                            <StyledInput
                                type="datetime-local"
                                name="requested_time"
                                value={formData.requested_time}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>
                    </FormGrid>

                    <SubmitButton
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <LoadingSpinner
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        ) : (
                            'Submit Request'
                        )}
                    </SubmitButton>
                </form>
            </GlassContainer>
        </PageWrapper>
    );
};

export default OutsiderRequestForm;