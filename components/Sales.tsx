'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'

type SalesEntry = {
    date: string;
    orders: number;
    revenue: number;
    expenses: number;
}

export default function SalesPage() {
    const [salesData, setSalesData] = useState<SalesEntry[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [orders, setOrders] = useState('')
    const [revenue, setRevenue] = useState('')
    const [expenses, setExpenses] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newEntry: SalesEntry = {
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            orders: parseInt(orders),
            revenue: parseFloat(revenue),
            expenses: parseFloat(expenses)
        }
        setSalesData([...salesData, newEntry])
        setOrders('')
        setRevenue('')
        setExpenses('')
    }

    const calculateTotals = () => {
        const totalOrders = salesData.reduce((sum, entry) => sum + entry.orders, 0)
        const totalRevenue = salesData.reduce((sum, entry) => sum + entry.revenue, 0)
        const totalExpenses = salesData.reduce((sum, entry) => sum + entry.expenses, 0)
        const grossProfit = totalRevenue - totalExpenses
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        return { totalOrders, totalRevenue, totalExpenses, grossProfit, averageOrderValue }
    }

    const { totalOrders, totalRevenue, totalExpenses, grossProfit, averageOrderValue } = calculateTotals()

    const extractExcelReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(salesData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data")

        const summaryData = [
            { label: "Total Orders", value: totalOrders },
            { label: "Total Revenue", value: totalRevenue },
            { label: "Total Expenses", value: totalExpenses },
            { label: "Gross Profit", value: grossProfit },
            { label: "Average Order Value", value: averageOrderValue }
        ]
        const summarySheet = XLSX.utils.json_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

        XLSX.writeFile(workbook, "sales_report.xlsx")
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto p-2 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Card className="md:col-span-2">
                        <CardHeader className="p-3">
                            <CardTitle className="text-lg">Upload Sales Data</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <Label htmlFor="date" className="text-sm">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                            required
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="orders" className="text-sm">Orders</Label>
                                        <Input
                                            id="orders"
                                            type="number"
                                            value={orders}
                                            onChange={(e) => setOrders(e.target.value)}
                                            required
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="revenue" className="text-sm">Revenue (PHP)</Label>
                                        <Input
                                            id="revenue"
                                            type="number"
                                            step="0.01"
                                            value={revenue}
                                            onChange={(e) => setRevenue(e.target.value)}
                                            required
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="expenses" className="text-sm">Expenses ($)</Label>
                                        <Input
                                            id="expenses"
                                            type="number"
                                            step="0.01"
                                            value={expenses}
                                            onChange={(e) => setExpenses(e.target.value)}
                                            required
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-8 text-sm">
                                    Upload Sales Data
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-lg">Select Date</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="p-3">
                        <CardTitle className="text-lg">Sales Data and Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <Tabs defaultValue="table">
                            <TabsList className="mb-3">
                                <TabsTrigger value="table" className="text-sm">Table</TabsTrigger>
                                <TabsTrigger value="chart" className="text-sm">Chart</TabsTrigger>
                                <TabsTrigger value="summary" className="text-sm">Summary</TabsTrigger>
                            </TabsList>
                            <TabsContent value="table">
                                <div className="max-h-64 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs">Date</TableHead>
                                                <TableHead className="text-xs">Orders</TableHead>
                                                <TableHead className="text-xs">Revenue</TableHead>
                                                <TableHead className="text-xs">Expenses</TableHead>
                                                <TableHead className="text-xs">Profit</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {salesData.map((entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-xs">{entry.date}</TableCell>
                                                    <TableCell className="text-xs">{entry.orders}</TableCell>
                                                    <TableCell className="text-xs">${entry.revenue.toFixed(2)}</TableCell>
                                                    <TableCell className="text-xs">${entry.expenses.toFixed(2)}</TableCell>
                                                    <TableCell className="text-xs">${(entry.revenue - entry.expenses).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                            <TabsContent value="chart">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 10 }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                                        <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                                        <Bar yAxisId="left" dataKey="expenses" fill="#82ca9d" name="Expenses ($)" />
                                        <Bar yAxisId="right" dataKey="orders" fill="#ffc658" name="Orders" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </TabsContent>
                            <TabsContent value="summary">
                                <div className="space-y-1 text-sm">
                                    <p>Total Orders: {totalOrders}</p>
                                    <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
                                    <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
                                    <p>Gross Profit: ${grossProfit.toFixed(2)}</p>
                                    <p>Average Order Value: ${averageOrderValue.toFixed(2)}</p>
                                    <Button onClick={extractExcelReport} className="mt-3 h-8 text-sm">
                                        Extract Excel Report
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}