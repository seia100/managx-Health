import React from 'react';
import UserProfile from '../components/UserManagement/UserProfile';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page">
        <h1>Dashboard</h1>
        <UserProfile />
        </div>
    );
};

export default Dashboard;
