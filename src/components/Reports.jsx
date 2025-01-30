import React, { useEffect, useState } from "react";
import Api from "../api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Download, FileSpreadsheet, X } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../assets/logo.jpeg';

// Enhanced Table Components
const Table = ({ children }) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="w-full border-collapse">{children}</table>
    </div>
);

const Thead = ({ children }) => (
    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
        <tr>{children}</tr>
    </thead>
);

const Tbody = ({ children }) => (
    <tbody className="divide-y divide-gray-100">{children}</tbody>
);

const Th = ({ children }) => (
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 tracking-wider">
        {children}
    </th>
);

const Td = ({ children }) => (
    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
        {children}
    </td>
);

const Report = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState("");
    const [userType, setUserType] = useState("");
    const [siteId, setSiteId] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setStatus("");
        setUserType("");
        setSiteId("");
        setPartnerName("");
        setActiveFilters([]);
        fetchReport(); // Fetch report with cleared filters
    };

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            const newFilters = [];

            // Track active filters
            if (startDate) {
                queryParams.append("startDate", dayjs(startDate).format("YYYY-MM-DD"));
                newFilters.push(`Start Date: ${dayjs(startDate).format("MMM D, YYYY")}`);
            }
            if (endDate) {
                queryParams.append("endDate", dayjs(endDate).format("YYYY-MM-DD"));
                newFilters.push(`End Date: ${dayjs(endDate).format("MMM D, YYYY")}`);
            }
            if (status) {
                queryParams.append("status", status);
                newFilters.push(`Status: ${status}`);
            }
            if (userType) {
                queryParams.append("userType", userType);
                newFilters.push(`User Type: ${userType}`);
            }
            if (siteId) {
                queryParams.append("site_id", siteId);
                newFilters.push(`Site ID: ${siteId}`);
            }
            if (partnerName) {
                queryParams.append("partner_name", partnerName);
                newFilters.push(`Partner: ${partnerName}`);
            }

            setActiveFilters(newFilters);

            const response = await fetch(Api.getUrl(`/report?${queryParams.toString()}`));
            if (!response.ok) throw new Error("Failed to fetch report data");
            const data = await response.json();
            setReportData(data);
        } catch (err) {
            setError("Error fetching report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

   
    const downloadAsPDF = () => {
        if (!reportData) return;

        const pdf = new jsPDF();
        
        // Add company logo
        pdf.addImage(Logo, 'PNG', 15, 15, 30, 30);
        
        // Custom header styling
        const primaryColor = '#F7434C';
        pdf.setFillColor(247, 67, 76); // #F7434C in RGB

        // Add stylish header
        pdf.setDrawColor(247, 67, 76);
        pdf.setLineWidth(0.5);
        pdf.line(15, 50, 195, 50);
        
        // Title
        pdf.setFontSize(24);
        pdf.setTextColor(247, 67, 76);
        pdf.text('Key Request Report', 50, 35);
        
        // Add date
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 45);
        
        let yPos = 70;

        // Add active filters section with styled box
        if (activeFilters.length > 0) {
            pdf.setFillColor(252, 235, 236); // Light version of primary color
            pdf.rect(15, yPos - 5, 180, activeFilters.length * 7 + 15, 'F');
            pdf.setFontSize(12);
            pdf.setTextColor(247, 67, 76);
            pdf.text('Applied Filters:', 20, yPos);
            yPos += 10;
            
            pdf.setTextColor(80);
            activeFilters.forEach(filter => {
                pdf.setFontSize(10);
                pdf.text(`• ${filter}`, 25, yPos);
                yPos += 7;
            });
            yPos += 10;
        }

        // Summary Cards with styled boxes
        pdf.setFontSize(16);
        pdf.setTextColor(247, 67, 76);
        pdf.text('Summary Overview', 15, yPos);
        yPos += 10;

        const summaryItems = [
            { label: 'Total Requests', value: reportData.summary?.totalRequests?.toString() || '0' },
            { label: 'Approved Requests', value: reportData.summary?.approvedRequests?.toString() || '0' },
            { label: 'Best Site', value: reportData.summary?.bestPerformingSite?.site_name || 'N/A' },
            { label: 'Top Partner', value: reportData.summary?.bestPartner?.partner_name || 'N/A' }
        ];

        // Create styled summary boxes
        summaryItems.forEach((item, index) => {
            const xPos = 15 + (index * 45);
            pdf.setFillColor(252, 235, 236);
            pdf.roundedRect(xPos, yPos, 40, 25, 2, 2, 'F');
            pdf.setFontSize(8);
            pdf.setTextColor(80);
            pdf.text(item.label, xPos + 3, yPos + 5);
            pdf.setFontSize(12);
            pdf.setTextColor(247, 67, 76);
            pdf.text(item.value, xPos + 3, yPos + 15);
        });

        yPos += 35;

        // Styled tables
        const tableStyles = {
            headStyles: {
                fillColor: [247, 67, 76],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: [252, 235, 236]
            },
            theme: 'grid',
            margin: { top: 15, bottom: 15 }
        };

        // Request Distribution Table
        pdf.setFontSize(14);
        pdf.setTextColor(247, 67, 76);
        pdf.text('Request Distribution', 15, yPos);
        
        pdf.autoTable({
            ...tableStyles,
            startY: yPos + 5,
            head: [['Site Name', 'Total Requests']],
            body: reportData.requestDistribution?.map(item => [
                item.site_name,
                item.total_requests.toString()
            ]) || []
        });

        yPos = pdf.lastAutoTable.finalY + 15;

        // Status Breakdown with colored status indicators
        if (pdf.lastAutoTable.finalY > 200) {
            pdf.addPage();
            yPos = 20;
        }

        pdf.setFontSize(14);
        pdf.text('Status Breakdown', 15, yPos);

        const statusColors = {
            'Approved': [39, 174, 96],
            'Pending': [241, 196, 15],
            'Denied': [231, 76, 60]
        };

        pdf.autoTable({
            ...tableStyles,
            startY: yPos + 5,
            head: [['Status', 'Total Requests']],
            body: reportData.statusBreakdown?.map(item => [
                {
                    content: item.status,
                    styles: { 
                        fillColor: statusColors[item.status] || [189, 195, 199]
                    }
                },
                item.total_requests.toString()
            ]) || []
        });

        // User Details Table
        pdf.addPage();
        
        // Add header to new page
        pdf.addImage(Logo, 'PNG', 15, 15, 20, 20);
        pdf.setFontSize(14);
        pdf.setTextColor(247, 67, 76);
        pdf.text('Users Who Requested Keys', 40, 25);

        pdf.autoTable({
            ...tableStyles,
            startY: 35,
            head: [['User Type', 'Name', 'Email', 'Phone', 'Site Name', 'Status', 'Date']],
            body: reportData.userDetails?.map(user => [
                user.user_type,
                user.requester_name,
                user.requester_email,
                user.requester_phone || 'N/A',
                user.site_name || 'N/A',
                {
                    content: user.status,
                    styles: { 
                        fillColor: statusColors[user.status] || [189, 195, 199],
                        textColor: 255
                    }
                },
                new Date(user.requested_time).toLocaleDateString()
            ]) || []
        });

        // Add footer
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(100);
            pdf.text(
                `Page ${i} of ${pageCount}`,
                pdf.internal.pageSize.width - 30,
                pdf.internal.pageSize.height - 10
            );
            // Add footer line
            pdf.setDrawColor(247, 67, 76);
            pdf.line(
                15,
                pdf.internal.pageSize.height - 20,
                pdf.internal.pageSize.width - 15,
                pdf.internal.pageSize.height - 20
            );
        }

        pdf.save('key-request-report.pdf');
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header with Logo */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="Logo" className="w-12 h-12 rounded-lg" />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F8434C] to-[#F8434C] bg-clip-text text-transparent">
    Key Request Report
</h2>
                    </div>
                    <button 
                        onClick={downloadAsPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download size={20} />
                        Download PDF
                    </button>
                </div>
                
                {activeFilters.length > 0 && (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Active Filters:</h3>
            <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1 text-[#F7434C] hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
                <X size={14} className="stroke-2" />
                Clear all filters
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-red-50 text-[#F7434C] rounded-full text-sm inline-flex items-center"
                >
                    {filter}
                </span>
            ))}
        </div>
    </div>
)}
                {/* Filters Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                label="Start Date" 
                                value={startDate} 
                                onChange={setStartDate}
                                className="w-full bg-white"
                            />
                            <DatePicker 
                                label="End Date" 
                                value={endDate} 
                                onChange={setEndDate}
                                className="w-full bg-white"
                            />
                        </LocalizationProvider>

                        <select 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Denied">Denied</option>
                            <option value="Returned">Returned</option>
                        </select>

                        <button 
                            onClick={fetchReport}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { 
                            label: "Total Requests", 
                            value: reportData?.summary?.totalRequests,
                            color: "from-blue-500 to-blue-600"
                        },
                        { 
                            label: "Approved Requests", 
                            value: reportData?.summary?.approvedRequests,
                            color: "from-green-500 to-green-600"
                        },
                        { 
                            label: "Best Performing Site", 
                            value: reportData?.summary?.bestPerformingSite?.site_name || "No Data",
                            color: "from-purple-500 to-purple-600"
                        },
                        { 
                            label: "Best Partner", 
                            value: reportData?.summary?.bestPartner?.partner_name || "No Data",
                            color: "from-indigo-500 to-indigo-600"
                        },
                    ].map(({ label, value, color }, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h3 className="text-sm text-gray-500 mb-2">{label}</h3>
                            <p className={`text-xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Enhanced Tables */}
                <div className="space-y-8">
                    {/* Site Distribution Table */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileSpreadsheet className="text-blue-600" />
                            Request Distribution by Site
                        </h3>
                        <Table>
                            <Thead>
                                <Th>Site Name</Th>
                                <Th>Total Requests</Th>
                            </Thead>
                            <Tbody>
                                {reportData?.requestDistribution?.map((site) => (
                                    <tr key={site.site_name}>
                                        <Td>{site.site_name}</Td>
                                        <Td>{site.total_requests}</Td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                    </div>

                    {/* Status Breakdown Table */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileSpreadsheet className="text-blue-600" />
                            Status Breakdown
                        </h3>
                        <Table>
                            <Thead>
                                <Th>Status</Th>
                                <Th>Total Requests</Th>
                            </Thead>
                            <Tbody>
                                {reportData?.statusBreakdown?.map((status) => (
                                    <tr key={status.status}>
                                        <Td>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                status.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                status.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                status.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {status.status}
                                            </span>
                                        </Td>
                                        <Td>{status.total_requests}</Td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                    </div>

                    {/* User Details Table */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileSpreadsheet className="text-blue-600" />
                            Users Who Requested Keys
                        </h3>
                        <Table>
                            <Thead>
                                <Th>User Type</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                                <Th>Site Name</Th>
                                <Th>Partner Name</Th>
                                <Th>Status</Th>
                                <Th>Requested Time</Th>
                            </Thead>
                            <Tbody>
                                {reportData?.userDetails?.map((user) => (
                                    <tr key={user.request_id}>
                                        <Td>{user.user_type}</Td>
                                        <Td>{user.requester_name}</Td>
                                        <Td>{user.requester_email}</Td>
                                        <Td>{user.requester_phone || "N/A"}</Td>
                                        <Td>{user.site_name || "N/A"}</Td>
                                        <Td>{user.partner_name || "N/A"}</Td>
                                        <Td>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                user.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </Td>
                                        <Td>{new Date(user.requested_time).toLocaleString()}</Td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;