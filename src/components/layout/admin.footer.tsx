'use client';
import React from 'react';
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;
    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Nguyen The Anh ©{new Date().getFullYear()} Created by @nguyentheanh
            </Footer>
        </>
    );
};

export default AdminFooter;