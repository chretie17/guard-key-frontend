import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, Mail, Phone, User, Briefcase } from 'lucide-react';
import Logo from '../assets/logo.jpeg';

// Styled Components
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
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.7);
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

const Title = styled.h1`
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #cc3d35 0%, #e53e3e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
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
    grid-column: ${props => (props.fullWidth ? '1 / -1' : 'auto')};
`;

const InputIcon = styled.div`
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #cc3d35;
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
    color: #1a1a1a;
    &:focus {
        border-color: #cc3d35;
        box-shadow: 0 0 0 4px rgba(204, 61, 53, 0.1);
    }
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 1.15rem 1.25rem 1.15rem 3.25rem;
    background: #ffffff;
    border: 2px solid rgba(203, 213, 224, 0.4);
    border-radius: 14px;
    font-size: 1rem;
    color: #1a1a1a;
    &:focus {
        border-color: #cc3d35;
        box-shadow: 0 0 0 4px rgba(204, 61, 53, 0.1);
    }
`;

const SubmitButton = styled(motion.button)`
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, #cc3d35 0%, #e53e3e 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 2.5rem;
`;

const Message = styled.div`
    padding: 1.25rem;
    margin: 1.25rem 0;
    border-radius: 14px;
    background: ${props => (props.isError ? 'rgba(254, 226, 226, 0.95)' : 'rgba(236, 253, 245, 0.95)')};
    color: ${props => (props.isError ? '#991b1b' : '#065f46')};
    border: 1px solid ${props => (props.isError ? 'rgba(153, 27, 27, 0.2)' : 'rgba(6, 95, 70, 0.2)')};
`;

// Form Component
const OutsiderRequestForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        site_id: '',
        partner_name: '',
        reason: '',
        requested_time: '',
    });

    const [sites, setSites] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const partners = ['MTN', 'Huawei', 'Airtel', 'Tres Rwanda']; // Predefined list of partners

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/public/active-sites'));
                setSites(response.data);
            } catch (error) {
                setMessage('Error loading sites.');
                setIsError(true);
            }
        };
        fetchSites();
    }, []);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post(Api.getUrl('/public/requests'), formData);
            setMessage(response.data.message);
            setIsError(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                site_id: '',
                partner_name: '',
                reason: '',
                requested_time: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error submitting request.');
            setIsError(true);
        }
    };

    return (
        <PageWrapper>
            <GlassContainer>
                <LogoWrapper>
                    <img src={Logo} alt="Logo" />
                    <Title>Partners Key Request</Title>
                </LogoWrapper>

                {message && <Message isError={isError}>{message}</Message>}

                <form onSubmit={handleSubmit}>
                    <FormGrid>
                        <InputWrapper>
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

                        <InputWrapper>
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

                        <InputWrapper>
                            <InputIcon>
                                <Phone size={20} />
                            </InputIcon>
                            <StyledInput
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>

                        <InputWrapper>
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

                        <InputWrapper>
                            <InputIcon>
                                <Briefcase size={20} />
                            </InputIcon>
                            <StyledSelect
                                name="partner_name"
                                value={formData.partner_name}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Partner</option>
                                {partners.map(partner => (
                                    <option key={partner} value={partner}>
                                        {partner}
                                    </option>
                                ))}
                            </StyledSelect>
                        </InputWrapper>

                        <InputWrapper fullWidth>
                            <StyledInput
                                type="text"
                                name="reason"
                                placeholder="Reason for Request"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                            />
                        </InputWrapper>

                        <InputWrapper fullWidth>
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

                    <SubmitButton type="submit">Submit Request</SubmitButton>
                </form>
            </GlassContainer>
        </PageWrapper>
    );
};

export default OutsiderRequestForm;
