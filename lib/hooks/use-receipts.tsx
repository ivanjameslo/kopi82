'use client'

import { useState, useEffect } from 'react';
import { fetchReceipt, ReceiptData } from '@/app/api/actions/fetch-receipts';

export function useReceipt(paymentId: number) {
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function loadReceipt() {
            try {
                setIsLoading(true)
                const data = await fetchReceipt(paymentId)
                if (data === null) {
                    throw new Error('Receipt not found')
                }
                setReceiptData(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'))
            } finally {
                setIsLoading(false)
            }
        }

        loadReceipt()
    }, [paymentId])

    return { receiptData, isLoading, error }
}