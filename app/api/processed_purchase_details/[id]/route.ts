import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET function to check if a purchase detail has been processed
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  
    const processed = await prisma.processedPurchaseDetails.findUnique({
      where: { ppd_id: parseInt(id) },
    });
  
    if (!processed) {
      return new Response('Not processed', { status: 404 });
    }
  
    return new Response('Already processed', { status: 200 });
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
  