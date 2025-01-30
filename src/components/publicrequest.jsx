import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../api';
import { Building2, Calendar, Mail, Phone, User, Briefcase, ChevronDown } from 'lucide-react';
import Logo from '../assets/logo.jpeg';


const validateEmail = (email, partner) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const partnerDomains = {
        'MTN': ['mtn.com', 'gmail.com'],
        'Huawei': ['huawei.com', 'gmail.com'],
        'Airtel': ['airtel.com', 'gmail.com'],
        'Tres Rwanda': ['tres.rw', 'gmail.com']
    };
    const domain = email.split('@')[1].toLowerCase();
    return partnerDomains[partner]?.includes(domain) || false;
};

const validatePhone = (phone) => {
    const phoneRegex = /^(\+250|07)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

const OutsiderRequestForm = () => {
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('partnerRequestForm');
        return savedData ? JSON.parse(savedData) : {
            name: '',
            email: '',
            phone: '',
            site_id: '',
            partner_name: '',
            reason: '',
            requested_time: '',
        };
    });

    const [sites, setSites] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const partners = ['MTN', 'Huawei', 'Airtel', 'Tres Rwanda'];

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

    useEffect(() => {
        localStorage.setItem('partnerRequestForm', JSON.stringify(formData));
    }, [formData]);

    const validateForm = () => {
        const errors = {};
        if (!validateEmail(formData.email, formData.partner_name)) {
            errors.email = `Please use a valid ${formData.partner_name || 'company'} email address or Gmail`;
        }
        if (!validatePhone(formData.phone)) {
            errors.phone = 'Please enter a valid Rwandan phone number (+250 or 07 format)';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (validationErrors[name]) {
                setValidationErrors(prev => ({ ...prev, [name]: '' }));
            }
            if (name === 'partner_name' && validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: '' }));
            }
            return newData;
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage('Please correct the validation errors.');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(Api.getUrl('/public/requests'), formData);
            setMessage(response.data.message);
            setIsError(false);
            const emptyForm = {
                name: '',
                email: '',
                phone: '',
                site_id: '',
                partner_name: '',
                reason: '',
                requested_time: '',
            };
            setFormData(emptyForm);
            localStorage.removeItem('partnerRequestForm');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error submitting request.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const InputIcon = ({ children }) => (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500/80">
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8 flex justify-center items-center font-sans">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 
                shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60
                transform transition-all duration-500 ease-out animate-fade-in">
                
                <div className="flex flex-col items-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-24 w-40 h-40 bg-gradient-to-br from-red-500 to-orange-500 rounded-full opacity-20 blur-2xl"></div>
                    <img 
                        src={Logo}
                        alt="Logo"
                        className="w-40 h-40 mb-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-center mb-4">
                        Partners Key Request
                    </h1>
                    <p className="text-gray-600 text-center max-w-lg">
                        Complete the form below to request access keys for our partner services
                    </p>
                </div>

                {message && (
                    <div className={`mb-8 transform transition-all duration-300 ${
                        isError 
                            ? 'bg-red-50 border-l-4 border-red-500 text-red-800'
                            : 'bg-green-50 border-l-4 border-green-500 text-green-800'
                    } p-6 rounded-2xl shadow-lg`}>
                        <p className="text-lg font-medium">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative group">
                            <InputIcon>
                                <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            />
                        </div>

                        <div className="relative group">
                            <InputIcon>
                                <Mail size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            />
                            {validationErrors.email && (
                                <span className="absolute -bottom-6 left-0 text-sm text-red-500 font-medium">
                                    {validationErrors.email}
                                </span>
                            )}
                        </div>

                        <div className="relative group">
                            <InputIcon>
                                <Phone size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number (+250 or 07...)"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            />
                            {validationErrors.phone && (
                                <span className="absolute -bottom-6 left-0 text-sm text-red-500 font-medium">
                                    {validationErrors.phone}
                                </span>
                            )}
                        </div>

                        <div className="relative group">
                            <InputIcon>
                                <Building2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            <select
                                name="site_id"
                                value={formData.site_id}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-10 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    appearance-none cursor-pointer focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <option value="">Select Site</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>
                                        {site.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative group">
                            <InputIcon>
                                <Briefcase size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            <select
                                name="partner_name"
                                value={formData.partner_name}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-10 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    appearance-none cursor-pointer focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <option value="">Select Partner</option>
                                {partners.map(partner => (
                                    <option key={partner} value={partner}>
                                        {partner}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative group md:col-span-2">
                            <textarea
                                name="reason"
                                placeholder="Reason for Request"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-6 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300 resize-none"
                            />
                        </div>

                        <div className="relative group md:col-span-2">
                            <InputIcon>
                                <Calendar size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </InputIcon>
                            <input
                                type="datetime-local"
                                name="requested_time"
                                value={formData.requested_time}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-gray-100 rounded-2xl text-gray-800 
                                    focus:border-red-500 focus:ring-4 focus:ring-red-500/10 
                                    shadow-sm hover:shadow-md transition-all duration-300"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 py-5 px-8 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 
                            text-white text-xl font-bold rounded-2xl shadow-lg shadow-red-500/30 
                            hover:shadow-xl hover:shadow-red-500/40 focus:ring-4 focus:ring-red-500/30
                            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300
                            disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {isLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    All fields are required. Your information will be handled securely.
                </div>
            </div>
        </div>
    );
};
export default OutsiderRequestForm;