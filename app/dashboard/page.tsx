'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';

export default function DashboardPage() {
    const router = useRouter();
    const { open_id, access_token } = router.query;

    interface UserInfo {
        username: string;
        display_name: string;
        avatar_url: string;
    }

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.isReady && access_token) {
            setLoading(true);
            // 调用后端接口获取用户信息
            fetch(`/api/get-user-info?access_token=${access_token}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserInfo(data.data.user);
                })
                .catch((error) => {
                    console.error('Error fetching user info:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [router.isReady, access_token]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            {userInfo ? (
                <div className="mb-6">
                    <h2>Welcome, {userInfo.username}</h2>
                    <p>Open ID: {open_id}</p>
                    <p>Display Name: {userInfo.display_name}</p>
                    <img src={userInfo.avatar_url} alt="Profile" className="w-16 h-16 rounded-full" />
                </div>
            ) : (
                <p>Failed to load user information.</p>
            )}
        </main>
    );
}