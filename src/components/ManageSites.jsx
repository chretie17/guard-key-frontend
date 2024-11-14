import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../api';
import { styled } from '@mui/system';
import { Building2, Edit2, Trash2 } from 'lucide-react';

const Container = styled('div')`
  padding: 32px;
  max-width: 1200px;
  margin: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const Header = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const Title = styled('h2')`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Form = styled('form')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 8px;
`;

const Input = styled('input')`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #E13A44;
    box-shadow: 0 0 0 3px rgba(225, 58, 68, 0.1);
  }
`;

const Select = styled('select')`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #E13A44;
    box-shadow: 0 0 0 3px rgba(225, 58, 68, 0.1);
  }
`;

const Button = styled('button')`
  padding: 12px 20px;
  background-color: ${props => props.delete ? '#fff' : '#E13A44'};
  color: ${props => props.delete ? '#E13A44' : '#fff'};
  border: ${props => props.delete ? '1px solid #E13A44' : 'none'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${props => props.delete ? '#fff5f5' : '#ca333c'};
    transform: translateY(-1px);
  }
`;

const Table = styled('table')`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 20px;
`;

const TableHeader = styled('th')`
  border-bottom: 2px solid #e5e7eb;
  padding: 16px;
  font-weight: 600;
  text-align: left;
  color: #374151;
  font-size: 14px;
`;

const TableData = styled('td')`
  border-bottom: 1px solid #e5e7eb;
  padding: 16px;
  color: #4b5563;
  font-size: 14px;
`;

const TableRow = styled('tr')`
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const StatusBadge = styled('span')`
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'Active':
        return '#dcfce7';
      case 'Inactive':
        return '#fee2e2';
      case 'Under Maintenance':
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active':
        return '#166534';
      case 'Inactive':
        return '#991b1b';
      case 'Under Maintenance':
        return '#92400e';
      default:
        return '#374151';
    }
  }};
`;

const ActionContainer = styled('div')`
  display: flex;
  gap: 8px;
`;

const ErrorMessage = styled('p')`
  color: #E13A44;
  background-color: #fee2e2;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const ManageSites = () => {
    const [sites, setSites] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', location: '', status: 'Active' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await axios.get(Api.getUrl('/sites'));
                setSites(response.data);
            } catch (err) {
                setError('Failed to fetch sites.');
                console.error(err);
            }
        };

        fetchSites();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (form.id) {
                response = await axios.put(Api.getUrl(`/sites/${form.id}`), form);
                setSites(sites.map(site => (site.id === form.id ? response.data : site)));
            } else {
                response = await axios.post(Api.getUrl('/sites'), form);
                setSites([...sites, response.data]);
            }
            setForm({ id: null, name: '', location: '', status: 'Active' });
            setError(null);
        } catch (err) {
            setError('Failed to save site.');
            console.error(err);
        }
    };

    const editSite = (site) => setForm(site);

    const deleteSite = async (siteId) => {
        try {
            await axios.delete(Api.getUrl(`/sites/${siteId}`));
            setSites(sites.filter(site => site.id !== siteId));
        } catch (err) {
            setError('Failed to delete site.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Header>
                <Building2 size={24} color="#E13A44" />
                <Title>Manage Sites</Title>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Site Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                />
                <Select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                </Select>
                <Button type="submit">
                    {form.id ? 'Update Site' : 'Add Site'}
                </Button>
            </Form>

            <Table>
                <thead>
                    <tr>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Location</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {sites.map(site => (
                        <TableRow key={site.id}>
                            <TableData>{site.id}</TableData>
                            <TableData>{site.name}</TableData>
                            <TableData>{site.location}</TableData>
                            <TableData>
                                <StatusBadge status={site.status}>
                                    {site.status}
                                </StatusBadge>
                            </TableData>
                            <TableData>
                                <ActionContainer>
                                    <Button onClick={() => editSite(site)}>
                                        <Edit2 size={16} />
                                        Edit
                                    </Button>
                                    <Button delete onClick={() => deleteSite(site.id)}>
                                        <Trash2 size={16} />
                                        Delete
                                    </Button>
                                </ActionContainer>
                            </TableData>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageSites;