import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <aside className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50
                         shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col z-50 overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10" />
            
            {/* Decorative header gradient */}
            <div className="absolute top-0 left-0 right-0 h-52 
                          bg-gradient-to-br from-[#E13A44] to-[#FF464F]
                          clip-path-polygon-[0_0,100%_0,100%_70%,0_100%] z-20" />
            
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 
                          bg-gradient-to-br from-white/10 to-transparent 
                          rounded-full -mr-20 -mt-20 z-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 
                          bg-gradient-to-tr from-[#E13A44]/5 to-transparent 
                          rounded-full -ml-16 -mb-16 z-20" />
            
            {/* Logo section */}
            <div className="relative z-30 p-8 text-center">
                <h1 className="text-5xl font-black tracking-wider text-white m-0 
                             drop-shadow-lg">
                    KTRN
                </h1>
                <div className="text-sm text-white/90 mt-2 tracking-wider font-medium">
                    Key Management System
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
                <ul className="p-6 space-y-2 relative z-30">
                    {role === 'Admin' && (
                        <>
                            <MenuItem to="/dashboard" icon="🎯">Dashboard</MenuItem>
                            <MenuItem to="/users" icon="👥">Manage Users</MenuItem>
                            <MenuItem to="/sites" icon="🏢">Manage Sites</MenuItem>
                            <MenuItem to="/admin-request" icon="📝">View Requests</MenuItem>
                            <MenuItem to="/adminoutsider" icon="🌐">View Public Requests</MenuItem>
                            <MenuItem to="/reports" icon="📊">Reports</MenuItem>
                        </>
                    )}
                    
                    {role === 'Technician' && (
                        <>
                            <MenuItem to="/request-access" icon="🔑">Request Access</MenuItem>
                            <MenuItem to="/my-requests" icon="📋">My Requests</MenuItem>
                        </>
                    )}
                    
                    {role === 'Outsider' && (
                        <>
                            <MenuItem to="/request-access" icon="🔑">Request Access</MenuItem>
                        </>
                    )}
                </ul>
            </nav>

            {/* Logout section */}
            <div className="relative z-30 p-6 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#E13A44] to-[#FF464F] 
                             text-white font-semibold rounded-xl
                             shadow-lg transition-all duration-300 
                             hover:shadow-2xl hover:-translate-y-0.5 
                             active:translate-y-0 
                             overflow-hidden relative
                             group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2">
                        Logout 
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                            →
                        </span>
                    </span>
                </button>
            </div>
        </aside>
    );
};

// MenuItem Component
const MenuItem = ({ to, children, icon }) => (
    <li className="transform transition-transform duration-200 hover:translate-x-1">
        <Link
            to={to}
            className="flex items-center gap-3 p-4 rounded-xl
                     text-gray-700 font-medium
                     bg-white/80 backdrop-blur-xl
                     border border-transparent
                     shadow-sm transition-all duration-300
                     hover:text-[#E13A44] hover:bg-white 
                     hover:border-[#E13A44]/10 hover:shadow-xl
                     relative group"
        >
            {/* Icon */}
            <span className="text-lg opacity-70 group-hover:opacity-100 
                           transition-opacity duration-300">
                {icon}
            </span>
            
            {/* Label */}
            <span className="transform group-hover:translate-x-0.5 
                           transition-transform duration-300">
                {children}
            </span>
            
            {/* Hover arrow */}
            <span className="ml-auto opacity-0 -translate-x-2
                           group-hover:opacity-100 group-hover:translate-x-0 
                           transition-all duration-300 text-[#E13A44]">
                →
            </span>
        </Link>
    </li>
);

export default Sidebar;