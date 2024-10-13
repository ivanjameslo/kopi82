"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Download, Plus } from "lucide-react";
import { format } from "date-fns";

interface SalesData {
    date: string;
    total: number;
}

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

const initialItems: MenuItem[] = [
    { id: 1, name: "Cappuccino", price: 150, category: "Drinks" },
    { id: 2, name: "Latte", price: 160, category: "Drinks" },
    { id: 3, name: "Espresso", price: 120, category: "Drinks" },
    { id: 4, name: "Croissant", price: 80, category: "Pastries" },
    { id: 5, name: "Muffin", price: 70, category: "Pastries" },
];

const initialSalesData: SalesData[] = [
    { date: "2023-05-01", total: 4500 },
    { date: "2023-05-02", total: 5200 },
    { date: "2023-05-03", total: 4800 },
    { date: "2023-05-04", total: 6000 },
    { date: "2023-05-05", total: 7500 },
    { date: "2023-05-06", total: 8200 },
    { date: "2023-05-07", total: 9000 },
];

export default function Sales() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
    const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });

    const totalSales = salesData.reduce((sum, day) => sum + day.total, 0);
    const averageSale = totalSales / salesData.length;

    const addItem = () => {
        if (newItem.name && newItem.price && newItem.category) {
            setItems([
                ...items,
                { ...newItem, id: items.length + 1, price: Number(newItem.price) },
            ]);
            setNewItem({ name: "", price: "", category: "" });
        }
    };

    const generateReport = () => {
        const csvContent = [
            ["Date", "Total Sales"],
            ...salesData.map((day) => [day.date, day.total.toString()]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "cafe_sales_report.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen p-8 text-whitesmoke">
            <h1 className="text-3xl font-bold mb-6 text-white">
                Cafe Sales Dashboard
            </h1>
            <Tabs defaultValue="dashboard">
                <TabsList className="mb-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-black text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₱{totalSales.toLocaleString()}</div>
                                <p className="text-xs text-gray-400">For the last 7 days</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Average Daily Sales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₱{averageSale.toFixed(2)}</div>
                                <p className="text-xs text-gray-400">Per day</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Top Selling Item
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Cappuccino</div>
                                <p className="text-xs text-gray-400">32 sold today</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Customer Satisfaction
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4.8/5</div>
                                <p className="text-xs text-gray-400">Based on 120 reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4">
                        <Card className="bg-black text-white">
                            <CardHeader>
                                <CardTitle>Sales Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        total: {
                                            label: "Total Sales",
                                            color: "hsl(var(--chart-1))",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={salesData}>
                                            <XAxis
                                                dataKey="date"
                                                stroke="#ffffff"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#ffffff"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value: number) => `₱${value}`}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="total" fill="#FAEED1" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4">
                        <Card className="bg-black text-white">
                            <CardHeader>
                                <CardTitle>Menu Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell className="text-right">₱{item.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={
                                        date
                                            ? "text-left font-normal text-black"
                                            : "text-left font-normal text-gray-500"
                                    }
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={generateReport}>
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="admin">
                    <Card className="bg-black text-white">
                        <CardHeader>
                            <CardTitle>Add New Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Item name"
                                        value={newItem.name}
                                        onChange={(e) =>
                                            setNewItem({ ...newItem, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        placeholder="Price in PHP"
                                        value={newItem.price}
                                        onChange={(e) =>
                                            setNewItem({ ...newItem, price: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        placeholder="Category"
                                        value={newItem.category}
                                        onChange={(e) =>
                                            setNewItem({ ...newItem, category: e.target.value })
                                        }
                                    />
                                </div>
                                <Button onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
