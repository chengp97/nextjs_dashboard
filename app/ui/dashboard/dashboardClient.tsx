'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserInfo {
    username: string;
    display_name: string;
    avatar_url: string;
}

export default function DashboardClient() {
    const searchParams = useSearchParams();
    const open_id = searchParams?.get('open_id') || '';
    const access_token = searchParams?.get('access_token') || '';

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (access_token) {
            fetch(`/api/get-user-info?access_token=${access_token}`)
                .then((res) => res.json())
                .then((data) => {
                    setUserInfo(data.data.user);
                })
                .catch((err) => {
                    console.error('Error fetching user info:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [access_token]);

    if (loading) return <p>Loading...</p>;

    return userInfo ? (
        <div className="mb-6">
            <h2>Welcome, {userInfo.username}</h2>
            <p>Open ID: {open_id}</p>
            <p>Display Name: {userInfo.display_name}</p>
            <img
                src={userInfo.avatar_url}
                alt="Profile"
                className="w-16 h-16 rounded-full"
            />
        </div>
    ) : (
        <p>Failed to load user information.</p>
    );
}
