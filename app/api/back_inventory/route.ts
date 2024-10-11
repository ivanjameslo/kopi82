import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const backInventoryWithShelves = await prisma.back_inventory.findMany({
        include: {
          inventory_shelf: {
            include: {
              shelf_location: true, 
            },
          },
          purchased_detail: {
            include: {
                item: {
                    include: {
                        unit: true,
                        category: true,
                    }
                },
            }
          },
        },
      });
      return NextResponse.json(backInventoryWithShelves);
    } catch (error) {
      console.error("Error fetching Back Inventory with Shelf Locations:", error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
  }
  
//   export async function POST(request: NextRequest) {
//     try {
//         const { items } = await request.json();

//         if (!items || !Array.isArray(items) || items.length === 0) {
//             return NextResponse.json({ error: "No items provided or invalid format" }, { status: 400 });
//         }

//         await prisma.$transaction(async (prisma) => {
//             for (const item of items) {
//                 // Step 1: Check if a back_inventory entry exists for the given item_id
//                 const existingBackInventory = await prisma.back_inventory.findFirst({
//                     where: {
//                         purchased_detail: {
//                             item: { item_id: item.item_id },
//                         },
//                     },
//                     include: { inventory_shelf: true },
//                 });

//                 if (existingBackInventory) {
//                     // Step 2: Update the back_inventory entry
//                     await prisma.back_inventory.update({
//                         where: { bd_id: existingBackInventory.bd_id },
//                         data: {
//                             pd_id: item.pd_id,  // Update pd_id
//                             stock_in_date: new Date(),
//                             stock_damaged: item.stock_damaged ?? existingBackInventory.stock_damaged,
//                             stock_used: item.stock_used ?? existingBackInventory.stock_used,
//                             stock_out_date: (item.stock_damaged || item.stock_used) ? new Date() : null,
//                         },
//                     });

//                     // Step 3: Check for the existing inventory_shelf entry
//                     const existingShelfEntry = existingBackInventory.inventory_shelf.find(
//                         shelf => shelf.sl_id === Number(item.sl_id)
//                     );

//                     if (existingShelfEntry) {
//                         // Step 4: Correctly update the quantity
//                         await prisma.inventory_shelf.update({
//                             where: {
//                                 is_id: existingShelfEntry.is_id,
//                             },
//                             data: {
//                                 quantity: existingShelfEntry.quantity + item.quantity,  // Only add the new quantity to the existing one
//                             },
//                         });
//                     } else {
//                         // Step 5: Create new inventory_shelf entry if shelf doesn't exist
//                         await prisma.inventory_shelf.create({
//                             data: {
//                                 bd_id: existingBackInventory.bd_id,
//                                 sl_id: Number(item.sl_id),
//                                 quantity: item.quantity,  // Add the new quantity
//                             },
//                         });
//                     }
//                 } else {
//                     // Step 6: If no back_inventory exists, create a new entry
//                     const newBackInventory = await prisma.back_inventory.create({
//                         data: {
//                             pd_id: item.pd_id,
//                             item_id: item.item_id,
//                             pi_id: item.pi_id,
//                             stock_in_date: new Date(),
//                             stock_damaged: item.stock_damaged || 0,
//                             stock_used: item.stock_used || 0,
//                             stock_out_date: (item.stock_damaged > 0 || item.stock_used > 0) ? new Date() : null,
//                         },
//                     });

//                     // Step 7: Create new inventory_shelf entry for the new back_inventory
//                     await prisma.inventory_shelf.create({
//                         data: {
//                             bd_id: newBackInventory.bd_id,
//                             sl_id: Number(item.sl_id),
//                             quantity: item.quantity,  // Set the initial quantity for the new shelf entry
//                         },
//                     });
//                 }
//             }
//         });

//         return NextResponse.json({ success: true }, { status: 201 });
//     } catch (error: any) {
//         console.error("Error creating Back Inventory:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }


export async function POST(request: NextRequest) {
    try {
        const { items } = await request.json();  // Get the items from the request body

        // Validate the items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "No items provided or invalid format" }, { status: 400 });
        }

        // Validate each item and log errors for missing fields
        const validItems = items.filter(item => {
            if (!item.item_id) console.error("item_id is missing for item", item);
            if (!item.pi_id) console.error("pi_id is missing for item", item);
            if (!item.sl_id) console.error("sl_id is missing for item", item);
            if (!item.quantity) console.error("quantity is missing for item", item);

            return item.pd_id && item.sl_id && item.quantity;
        });

        if (validItems.length !== items.length) {
            return NextResponse.json({ error: "Some items have missing fields (item_id, pi_id, sl_id, or quantity)" }, { status: 400 });
        }

        // Step 1: Create back_inventory entries for the selected items (without quantity)
        const createdBackInventory = await prisma.back_inventory.createMany({
            data: validItems.map(item => ({
                pd_id: item.pd_id,
                item_id: item.item_id,
                stock_in_date: new Date(),
                stock_damaged: item.stock_damaged || 0,
                stock_used: item.stock_used || 0,
                stock_out_date: (item.stock_damaged > 0 || item.stock_used > 0) ? new Date() : null,
            })),
            skipDuplicates: true,
        });

        // Step 2: Fetch the newly created back_inventory entries to get the bd_id
        const createdRecords = await prisma.back_inventory.findMany({
            where: { pd_id: { in: validItems.map(item => item.pd_id) } },
        });

        // Step 3: Create inventory_shelf entries using the bd_id, sl_id, and quantity
        const inventoryShelfData = validItems.map(item => {
            const correspondingBackInventory = createdRecords.find(
                (record) => record.pd_id === item.pd_id
            );
            if (!correspondingBackInventory) {
                throw new Error(`Back Inventory for item ${item.pd_id} not found`);
            }

            return {
                bd_id: correspondingBackInventory.bd_id,  // Link to back_inventory
                sl_id: Number(item.sl_id),  // Shelf location
                quantity: item.quantity,  // Quantity of items to store
            };
        });

        // Insert into the inventory_shelf table
        await prisma.inventory_shelf.createMany({
            data: inventoryShelfData,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating Back Inventory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
