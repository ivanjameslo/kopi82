'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { FileDown } from 'lucide-react'
import { CellHookData } from 'jspdf-autotable'
import { ReceiptData } from '@/app/api/actions/fetch-receipts'

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

interface ReceiptPDFButtonProps {
    receipt: ReceiptData
}

export default function ReceiptPDFButton({ receipt }: ReceiptPDFButtonProps) {
    const [generatingPDF, setGeneratingPDF] = useState(false)
    // const [jpgDataUrl, setJpgDataUrl] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // useEffect(() => {
    //     const loadImage = async () => {
    //         try {
    //             const img = new Image()
    //             img.onload = () => {
    //                 if (canvasRef.current) {
    //                     const canvas = canvasRef.current
    //                     canvas.width = img.width
    //                     canvas.height = img.height
    //                     const ctx = canvas.getContext('2d')
    //                     if (ctx) {
    //                         ctx.fillStyle = 'white'
    //                         ctx.fillRect(0, 0, canvas.width, canvas.height)
    //                         ctx.drawImage(img, 0, 0)
    //                         setJpgDataUrl(canvas.toDataURL('image/jpeg'))
    //                     }
    //                 }
    //             }
    //             img.onerror = (e) => {
    //                 console.error('Error loading image:', e)
    //             }
    //             img.src = '/kopi.png' // Use your PNG logo directly
    //         } catch (error) {
    //             console.error('Failed to load image:', error)
    //         }
    //     }

    //     loadImage()
    // }, [])

    const generatePDF = () => {
        // if (!jpgDataUrl) {
        //     console.error('JPG not ready yet')
        //     return
        // }

        setGeneratingPDF(true)

        const doc = new jsPDF()

        addReceiptPage(doc)

        doc.save(`Receipt_${receipt.payment.order?.customer_name || 'Customer'}_${new Date(receipt.payment.createdAt).toISOString().split('T')[0]}.pdf`)
        setGeneratingPDF(false)
    }

    const addReceiptPage = (doc: jsPDF) => {
        // Set the background to white
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F')

        // Add logo
        // doc.addImage(jpgDataUrl!, 'JPG', 14, 10, 50, 20)

        // Add company name and details
        doc.setFontSize(18)
        doc.setTextColor(139, 69, 19) // Updated line
        doc.setFont('helvetica', 'bold')
        doc.text('Kopi 82', 14, 40)
        doc.setFontSize(10)
        doc.setTextColor(52, 73, 94)
        doc.text('Wheels N’ More Drive, Jose P. Laurel Bajada, Brgy. 13-B, Davao City', 14, 46)
        doc.text('Phone: (082) 308 2961', 14, 51)
        doc.text("Email: Kopi82abklmp@gmail.com", 14, 56)

        // Add RECEIPT title
        doc.setFontSize(24)
        doc.setTextColor(139, 69, 19) // Change this 
        doc.text('RECEIPT', doc.internal.pageSize.width - 16, 18, { align: 'right' })

        // Add customer info
        doc.setFontSize(12)
        doc.setTextColor(52, 73, 94)
        doc.setFont('helvetica', 'bold')
        doc.text('CUSTOMER INFORMATION', 14, 70)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(`Name: ${receipt.payment.order?.customer_name || 'N/A'}`, 14, 77)
        doc.text(`Service Type: ${receipt.payment.order?.service_type || 'N/A'}`, 14, 83)

        // Add payment information
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('PAYMENT INFORMATION', 120, 70)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(`Date: ${new Date(receipt.payment.createdAt).toLocaleString()}`, 120, 77)
        doc.text(`Payment Method: ${receipt.payment.payment_method}`, 120, 83)
        doc.text(`Payment Status: ${receipt.payment.payment_status}`, 120, 89)

        // Add order details table
        const orderDetailsBody = receipt.payment.order?.order_details.map(detail => [
            detail.product.product_name,
            detail.quantity.toString(),
            `PHP${detail.price.toFixed(2)}`,
            `PHP${(detail.price * detail.quantity).toFixed(2)}`
        ]) || []

        doc.autoTable({
            startY: 100,
            head: [['Item', 'Quantity', 'Unit Price', 'Total']],
            body: orderDetailsBody,
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [139, 69, 19], textColor: 255 }, // Change this line
            columnStyles: {
                0: { cellWidth: 70, halign: 'left' },
                1: { cellWidth: 30, halign: 'right' },
                2: { cellWidth: 40, halign: 'right' },
                3: { cellWidth: 40, halign: 'right' }
            },
            didParseCell: (data: CellHookData) => {
                if (data.section === 'head' && data.column.index > 0) {
                    data.cell.styles.halign = 'right'
                }
            }
        })

        const finalY = (doc as any).lastAutoTable.finalY || 100

        // Calculate totals
        const subtotal = receipt.payment.order?.order_details.reduce(
            (sum, detail) => sum + (detail.price * detail.quantity),
            0
        ) || 0


        const discountAmount = receipt.payment.discount
            ? subtotal * (receipt.payment.discount.discount_rate / 100)
            : 0

        const total = subtotal - discountAmount

        // Add totals
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Subtotal:', 130, finalY + 10)
        doc.text(`PHP${subtotal.toFixed(2)}`, 180, finalY + 10, { align: 'right' })

        if (receipt.payment.discount) {
            doc.text('Discount:', 130, finalY + 16)
            doc.text(`PHP${discountAmount.toFixed(2)}`, 180, finalY + 16, { align: 'right' })
        }

        doc.setFontSize(12)
        doc.text('Total:', 130, finalY + 22)
        doc.text(`PHP${total.toFixed(2)}`, 180, finalY + 22, { align: 'right' })

        if (receipt.payment.amount) {
            doc.text('Amount Paid:', 130, finalY + 28)
            doc.text(`PHP${receipt.payment.amount.toFixed(2)}`, 180, finalY + 28, { align: 'right' })
        }

        if (receipt.payment.change) {
            doc.text('Change:', 130, finalY + 34)
            doc.text(`PHP${receipt.payment.change.toFixed(2)}`, 180, finalY + 34, { align: 'right' })
        }

        // Add footer
        doc.setFontSize(8)
        doc.setTextColor(127, 140, 141)
        doc.text(`Receipt ID: ${receipt.payment.payment_id}`, 14, doc.internal.pageSize.height - 15)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10)
    }

    return (
        <>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Button
                onClick={generatePDF}
                disabled={generatingPDF}
                size="sm"
                variant="outline"
            >
                {generatingPDF ? (
                    'Generating...'
                ) : (
                    <>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Receipt
                    </>
                )}
            </Button>
        </>
    )
}
