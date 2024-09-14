import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

  // GET function to check if a purchase detail has been processed
  export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
      // Fetch the processed purchase detail by its pd_id
      const processed = await prisma.processedPurchaseDetails.findUnique({
        where: { pd_id: parseInt(id) },
      });

      // If the purchase detail is not found, return a 404 response
      if (!processed) {
        return new Response(JSON.stringify({ processed: false, message: 'Not processed' }), { status: 404 });
      }

      // If the purchase detail is found, return a 200 response with a 'processed' status
      return new Response(JSON.stringify({ processed: true, message: 'Already processed' }), { status: 200 });
    } catch (error) {
      console.error(`Error fetching purchase detail with pd_id ${id}:`, error);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
  }
  
  // POST function to mark a purchase detail as processed
  export async function POST(request: NextRequest) {
    try {
      const { purchase_detail_id } = await request.json();
  
      const processedPurchase = await prisma.processedPurchaseDetails.create({
        data: {
          pd_id: parseInt(purchase_detail_id),
        },
      });
  
      return new Response(JSON.stringify(processedPurchase), { status: 201 });
    } catch (error) {
      console.error('Error processing purchase detail:', error);
      return new Response('Failed to mark purchase detail as processed', { status: 500 });
    }
  }
  