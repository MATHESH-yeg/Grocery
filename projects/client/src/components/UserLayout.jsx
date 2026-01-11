import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const UserLayout = () => {
    return (
        <div className="container-responsive py-8">
            <div className="grid lg:grid-cols-[280px,1fr] gap-8">
                <UserSidebar />
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
