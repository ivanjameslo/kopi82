import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET function to fetch a single back inventory item
export async function GET(request: Request, { params }: { params: { bd_id: string } }) {
    const bd_id = params.bd_id;
    const back_inventory = await prisma.back_inventory.findUnique({
        where: {
            bd_id: parseInt(bd_id, 10)
        }
    });
    return NextResponse.json(back_inventory);
}

// PUT function to update the entire back inventory item
export async function PUT(request: Request, { params }: { params: { bd_id: string } }) {
    const bd_id = params.bd_id;
    const json = await request.json();
    delete json.bd_id;

    if (json.po_id) {
        json.po_id = parseInt(json.po_id, 10);
    }

    try {
        const updatedBackInventory = await prisma.back_inventory.update({
            where: { bd_id: parseInt(bd_id, 10) },
            data: {
                item_id: json.item_id,
                item_stocks: json.item_stocks,
                unit_id: json.unit_id,
                category_id: json.category_id,
                ls_id: json.ls_id,
                stock_in_date: json.stock_in_date,
                stock_damaged: json.stock_damaged,
                purchase_order: {
                    connect: { po_id: json.po_id }
                }
            }
        });
        return NextResponse.json(updatedBackInventory);
    } catch (error) {
        console.error('Error updating back_inventory:', error);
        return NextResponse.json({ error: 'Failed to update back_inventory' }, { status: 500 });
    }
}

// PATCH function to update part of the back inventory item
// export async function PATCH(request: NextRequest) {
//     try {
//       const updateDataArray = await request.json();
  
//       // Validate that updateDataArray is an array
//       if (!Array.isArray(updateDataArray)) {
//         return NextResponse.json({ error: 'Invalid input data format' }, { status: 400 });
//       }
  
//       const updatePromises = updateDataArray.map(async (updateData) => {
//         const { bd_id, ...data } = updateData;
  
//         // Ensure that bd_id is present
//         if (!bd_id) {
//           throw new Error('bd_id is required for updating back_inventory');
//         }
  
//         // Ensure that po_id is correctly handled
//         if (data.po_id === null) {
//           data.po_id = undefined;
//         }
  
//         return prisma.back_inventory.update({
//         where: { bd_id: Number(bd_id) }, // Ensure the correct primary key field is used
//         data: {
//           stock_in_date: data.stock_in_date ? new Date(data.stock_in_date) : undefined,
//           expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
//           stock_damaged: data.stock_damaged,
//           po_id: data.po_id,
//           item_stocks: data.item_stocks,
//           pd_id: data.pd_id,
//           stock_out_date: data.stock_out_date ? new Date(data.stock_out_date) : undefined,
//         },
//       });
//     });

//     const updatedBackInventory = await Promise.all(updatePromises);

//     return NextResponse.json(updatedBackInventory);
//   } catch (error) {
//     console.error('Error patching back_inventory:', error);
//     return NextResponse.json({ error: 'Failed to patch back_inventory', details: error }, { status: 500 });
//   }
// }

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const data = await request.json();
  
      console.log('Received data for PATCH:', data); // Log received data
  
      // Validate data (e.g., required fields) before processing
      if (!data.stock_damaged && !data.stock_out_date && !data.item_stocks && !data.stock_in_date) {
        return new Response('Invalid data', { status: 400 });
      }
  
      // Your database update logic goes here
      const updatedItem = await prisma.back_inventory.update({
        where: { bd_id: parseInt(id) },
        data: {
          ...data,
        },
      });
  
      return new Response(JSON.stringify(updatedItem), { status: 200 });
    } catch (error) {
      console.error('Error during PATCH:', error); // Log error
      return new Response('Failed to update item', { status: 500 });
    }
  }
  

// DELETE function to delete a back inventory item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
  
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
  
    try {
      const deletedItem = await prisma.back_inventory.delete({
        where: {
          bd_id: parseInt(id, 10),
        },
      });
  
      return NextResponse.json(deletedItem);
    } catch (error) {
      console.error('Failed to delete item: ', error);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
  }
