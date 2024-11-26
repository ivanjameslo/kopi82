// import prisma from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const inventory = await prisma.inventory_shelf.findMany({
//       include: {
//         back_inventory: {
//           include: {
//             purchased_detail: {
//               include: {
//                 item: {
//                   select: {
//                     item_id: true,
//                     item_name: true,
//                     description: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         ProductInventory: {
//           select: {
//             product_id: true,
//             required_quantity: true,
//           },
//         },
//       },
//     });

//     // Process inventory to compute status dynamically
//     const processedInventory = inventory.map((shelf) => {
//       const item = shelf.back_inventory?.purchased_detail?.item;
//       const requiredQuantity =
//         shelf.ProductInventory?.[0]?.required_quantity || 1; // Default to 1 if no specific requirement is found

//       if (!item) {
//         return null; // Skip shelves without items
//       }

//       const status =
//         shelf.quantity > requiredQuantity
//           ? "Widely Available"
//           : shelf.quantity > 0
//           ? "Low in Stock"
//           : "Out of Stock";

//       return {
//         item_id: item.item_id,
//         item_name: item.item_name,
//         description: item.description,
//         quantity: shelf.quantity,
//         required_quantity: requiredQuantity,
//         status,
//       };
//     });

//     const validInventory = processedInventory.filter((entry) => entry !== null);

//     return NextResponse.json(validInventory);
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
//   }
// }
