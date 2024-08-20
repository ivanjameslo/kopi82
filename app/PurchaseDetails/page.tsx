'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

const purchaseDetails = () => {
    
    const router = useRouter();

    return (
        <div>
            <div>
                <h1 className="flex justify-center">Purchase Details</h1>
            </div>
            <div>
                tables will be displayed here
            </div>
        </div>
    );
}

export default purchaseDetails;