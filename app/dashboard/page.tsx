'use client'; // 确保整个组件在客户端渲染

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';

export default function DashboardPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 从查询参数中获取 open_id 和 access_token
    const open_id = searchParams.get('open_id');
    const access_token = searchParams.get('access_token');

    interface UserInfo {
        username: string;
        display_name: string;
        avatar_url: string;
    }

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (access_token) {
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
    }, [access_token]);

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