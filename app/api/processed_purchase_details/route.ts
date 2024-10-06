// import { prisma } from "@/utils/prisma";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Purchase Order model
export async function GET(request: NextRequest) {
  try {
    const processed_purchase_order = await prisma.processedPurchaseDetails.findMany();
    console.log(processed_purchase_order);
    return NextResponse.json(processed_purchase_order);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// POST function to create a new Purchase Order
// export async function POST(request: NextRequest) {
//   try {
//     const { pd_id } = await request.json();  // Expecting an array of pd_ids

//     if (!pd_id || !Array.isArray(pd_id)) {
//       return NextResponse.json({ error: "No valid pd_ids provided" }, { status: 400 });
//     }

//     // Filter out already processed pd_ids
//     const existingRecords = await prisma.processedPurchaseDetails.findMany({
//       where: {
//         pd_id: {
//           in: pd_id,  // Check if any of the pd_ids already exist
//         },
//       },
//     });

//     const alreadyProcessedIds = existingRecords.map(record => record.pd_id);
//     const newPdIds = pd_id.filter(pd_id => !alreadyProcessedIds.includes(pd_id));

//     // If no new pd_ids, return conflict status
//     if (newPdIds.length === 0) {
//       return NextResponse.json({ message: "All pd_ids already processed" }, { status: 409 });
//     }

//     // Insert new pd_ids into the processed_purchase_details table
//     const processedPurchases = await prisma.processedPurchaseDetails.createMany({
//       data: newPdIds.map(pd_id => ({ pd_id })),
//     });

//     return NextResponse.json({
//       message: 'Purchase details processed successfully',
//       processedPurchases,
//       alreadyProcessedIds,
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error processing POST request:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

//ORIGINAL CODE
export async function POST(request: NextRequest) {
  try {
      const { pd_id } = await request.json();

      if (!pd_id) {
          return NextResponse.json({ error: "No pd_id provided" }, { status: 400 });
      }

      // Check if the pd_id already exists in the processed_purchase_details
      const existingRecord = await prisma.processedPurchaseDetails.findFirst({
          where: { pd_id: pd_id }
      });

      if (existingRecord) {
          return NextResponse.json({ message: "pd_id already processed" }, { status: 409 });
      }

      // Insert pd_id into the processed_purchase_details table
      const processedPurchase = await prisma.processedPurchaseDetails.createMany({
          data: {
              pd_id: pd_id,
          },
      });

      return NextResponse.json({ message: 'Purchase detail processed successfully', processedPurchase }, { status: 201 });
  } catch (error) {
      console.error('Error processing POST request:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}