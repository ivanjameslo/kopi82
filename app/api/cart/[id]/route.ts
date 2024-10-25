// import prisma from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// // GET function for fetching a single cart item
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const id = params.id;
//   const cartItem = await prisma.cart.findUnique({
//     where: {
//       id: Number(id),
//       prductId: Number,
//       productName: String,
//       quantity: Number,
//         price: Number,


//     },
//   });
//   return NextResponse.json(cartItem);
// }

// // PATCH function for updating an existing cart item
// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const cartItemId = params.id;
//     const res = await request.json();
//     const { productId, quantity } = res;

//     // Update the cart item using Prisma
//     const updatedCartItem = await prisma.cartItemModel.update({
//       where: { cart_item_id: Number(cartItemId) },
//       data: {
//         productId,
//         quantity: parseInt(quantity, 10),
//       },
//     });

//     return NextResponse.json(updatedCartItem, { status: 200 });
//   } catch (error) {
//     console.error("Error updating cart item", error);
//     return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
//   }
// }

// // DELETE function for deleting a cart item
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const cartItemId = params.id;
//     const cartItem = await prisma.cartItemModel.delete({
//       where: {
//         cart_item_id: Number(cartItemId),
//       },
//     });
//     return NextResponse.json(cartItem, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting cart item", error);
//     return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
//   }
// }

// // POST function for adding a new item to the cart
// export async function POST(request: NextRequest) {
//   try {
//     const res = await request.json();
//     const { productId, quantity } = res;

//     // Create a new cart item using Prisma
//     const newCartItem = await prisma.cartItemModel.create({
//       data: {
//         productId,
//         quantity: parseInt(quantity, 10),
//       },
//     });

//     return NextResponse.json(newCartItem, { status: 201 });
//   } catch (error) {
//     console.error("Error adding to cart", error);
//     return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
//   }
// }
