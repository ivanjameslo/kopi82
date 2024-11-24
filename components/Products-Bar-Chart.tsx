'use client'

import { useState, useEffect } from 'react'

interface SalesData {
    month: string
    netTotal: number
}
import { Bar, BarChart, Line, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell, Legend, Tooltip } from 'recharts'

interface TopSellingItem {
    name: string
    quantity: number
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchYearlySalesData, fetchTopSellingItems, fetchProductsSold, TimeFrame } from '../app/api/actions/salesactions'

const COLORS = ['#2D2424', '#5C4033', '#967969', '#C4A484', '#DCD7C9']

export default function SalesOverview() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [salesData, setSalesData] = useState<SalesData[]>([])
    const [topItems, setTopItems] = useState<TopSellingItem[]>([])
    const [productsTimeframe, setProductsTimeframe] = useState<TimeFrame>('monthly')
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState<{ name: string; price: number }[]>([])
    const [totalProducts, setTotalProducts] = useState(0)

    useEffect(() => {
        const loadSalesData = async () => {
            const data = await fetchYearlySalesData(parseInt(selectedYear))
            setSalesData(data)
        }
        loadSalesData()
    }, [selectedYear])

    useEffect(() => {
        const loadTopItems = async () => {
            const items = await fetchTopSellingItems()
            setTopItems(items)
        }
        loadTopItems()
    }, [])

    useEffect(() => {
        const loadProducts = async () => {
            const { products, total } = await fetchProductsSold(productsTimeframe, currentPage)
            setProducts(products)
            setTotalProducts(total)
        }
        loadProducts()
    }, [productsTimeframe, currentPage])

    const totalPages = Math.ceil(totalProducts / 10)

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Sales Overview</h1>

            {/* Sales Total Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Sales Total</CardTitle>
                    </div>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <XAxis dataKey="month" />
                                <YAxis
                                    tickFormatter={(value) => `PHP ${value}`}
                                    domain={[0, 'dataMax + 1000']}
                                />
                                <Tooltip
                                    formatter={(value) => [`PHP ${value}`, 'Net Total']}
                                    labelFormatter={(label) => `Month: ${label}`}
                                />
                                <Bar dataKey="netTotal" fill="#967969" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                {/* Top Selling Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topItems}
                                        dataKey="quantity"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                    >
                                        {topItems.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`Quantity: ${value}`, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Sold */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products Sold</CardTitle>
                        <Tabs value={productsTimeframe} onValueChange={(v) => setProductsTimeframe(v as TimeFrame)}>
                            <TabsList>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                                <TabsTrigger value="all-time">All Time</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell className="text-right">PHP {product.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-center space-x-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

