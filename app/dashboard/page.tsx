'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

export default function DashboardPage() {
    const router = useRouter();
    const { open_id, access_token } = router.query;

    interface UserInfo {
        username: string;
        display_name: string;
        avatar_url: string;
    }

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (access_token) {
            // 调用后端接口获取用户信息
            fetch(`/api/get-user-info?access_token=${access_token}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserInfo(data.data.user);
                })
                .catch((error) => {
                    console.error('Error fetching user info:', error);
                });
        }
    }, [access_token]);

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
                <p>Loading user information...</p>
            )}
            {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div> */}
        </main>
    );
}