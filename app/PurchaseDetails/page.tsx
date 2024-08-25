'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

const purchaseDetails = () => {
    
    const router = useRouter();

    //UTILIZE THE GET FUNCTION HERE 

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Purchase Details
            </p>
            <div>
                tables will be displayed here
            </div>
        </div>
    );
}

export default purchaseDetails;