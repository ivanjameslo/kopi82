'use client'

import { useState, useEffect } from 'react'
import { fetchProductOrderDetails, fetchSalesData, MonthlySales, ProductOrderDetail } from '@/app/api/actions/salesactions'

export function useProductOrderDetails() {
    const [timeframe, setTimeframe] = useState<'monthly' | 'yearly' | 'all-time'>('monthly')
    const [data, setData] = useState<ProductOrderDetail[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setIsLoading(true)
            try {
                const result = await fetchProductOrderDetails(timeframe)
                setData(result)
            } catch (error) {
                console.error('Failed to fetch product order details:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [timeframe])

    return { data, isLoading, timeframe, setTimeframe }
}



export function useSalesData() {
    const currentYear = new Date().getFullYear()
    const [year, setYear] = useState(currentYear)
    const [data, setData] = useState<MonthlySales[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadData() {
            setIsLoading(true)
            setError(null)
            try {
                const result = await fetchSalesData(year)
                setData(result)
            } catch (err) {
                setError('Failed to fetch sales data')
                console.error('Error fetching sales data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [year])

    return { data, isLoading, error, year, setYear }
}

