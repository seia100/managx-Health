import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile } from '../../services/api';

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState({ name: '', email: '' });

    useEffect(() => {
        const loadProfile = async () => {
        const data = await fetchUserProfile();
        setProfile(data);
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        await updateUserProfile(profile);
        alert('Profile updated successfully');
    };

    return (
        <div>
        <h2>User Profile</h2>
        <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default UserProfile;
