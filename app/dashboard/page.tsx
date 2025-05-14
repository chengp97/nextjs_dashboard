import { Suspense } from 'react';
import DashboardClient from '@/app/ui/dashboard/dashboardClient';


export default function DashboardPage() {
    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
            <Suspense fallback={<p>Loading dashboard...</p>}>
                <DashboardClient />
            </Suspense>
        </main>
    );
}
