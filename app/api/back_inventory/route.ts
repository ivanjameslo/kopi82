import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const backInventoryWithShelves = await prisma.back_inventory.findMany({
        include: {
          inventory_shelf: {
            include: {
              shelf_location: true,
              unit: true, 
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
            if (!item.sl_id) console.error("sl_id is missing for item", item);
            if (!item.quantity) console.error("quantity is missing for item", item);
            if (!item.unit_id) console.error("unit_id is missing for item", item);
        
            return item.item_id && item.pi_id && item.sl_id && item.quantity && item.unit_id;
        });

        if (validItems.length !== items.length) {
            return NextResponse.json({ error: "Some items have missing fields (item_id, pi_id, sl_id, or quantity)" }, { status: 400 });
        }

        // Step 1: Ensure the unit exists or create it if doesn't
        for (const item of validItems) {
            if (!item.unit_name) {
                console.error(`unit_name is missing for item ${item.item_id}`);
                return NextResponse.json({ error: `unit_name missing for item ${item.item_id}` }, { status: 400 });
            }
            
            let unitRecord = await prisma.unit.findFirst({
                where: { unit_name: item.unit_name.toLowerCase() },
            });

            // If the unit doesn't exist, create it
            if (!unitRecord) {
                unitRecord = await prisma.unit.create({
                    data: { unit_name: item.unit_name },
                });
            }

            item.unit_id = unitRecord.unit_id;
        }

        // Step 2: Create back_inventory entries for the selected items (without quantity)
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

        // Step 3: Fetch the newly created back_inventory entries to get the bd_id
        const createdRecords = await prisma.back_inventory.findMany({
            where: { pd_id: { in: validItems.map(item => item.pd_id) } },
        });

        // Step 4: Create inventory_shelf entries using the bd_id, sl_id, quantity, and unit_id
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
                unit_id: item.unit_id,
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
