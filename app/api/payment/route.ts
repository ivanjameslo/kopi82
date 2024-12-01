import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET function to fetch all data from Order model
export async function GET(request: NextRequest) {
  try {
    const payment = await prisma.payment.findMany({
        
      select: {
            payment_id: true,
            payment_method: true,
            payment_status: true,
            // e-wallet
            reference_no: true,
            //card
            account_number: true,
            account_name: true,
            cvv: true,
            expiry_date: true,
            //otc
            amount: true,
            change: true,
            discount: {
                select: {
                    discount_id: true,
                    discount_name: true,
                    discount_rate: true,
                    status: true,
                },
            },
            order: {
                select: {
                  order_id: true,
                  customer_name: true,
                  service_type: true,
                  date: true,
                    order_details: {
                        select: {
                            orderDetails_id: true,
                            product: {
                                select: {
                                    product_id: true,
                                    product_name: true,
                                    image_url: true,
                                },
                            },
                            quantity: true,
                            price: true,
                        },
                    },
                },
            },
            createdAt: true,
        },
    });
    return NextResponse.json(payment, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch Order Details." },
      { status: 500 }
    );
  }
}

// POST function to create a new payment
export async function POST(request: NextRequest){
    try{
        const res = await request.json();
        const {
            payment_method,
            payment_status,
            reference_no,
            account_number,
            account_name,
            cvv,
            expiry_date,
            amount,
            change,
            generated_code,
            createdAt,
            order_id,
            discount_id,  
        } = res;
        console.log("Data to Insert:", res);
        const created = await prisma.payment.create({
            data: {
                payment_method,
                payment_status,
                reference_no,
                account_number,
                account_name,
                cvv,
                expiry_date,
                amount: amount ? parseFloat(amount) : null, // Convert to Float
                change: change ? parseFloat(change) : null, // Convert to Float
                generated_code,
                createdAt: new Date(createdAt),
                order: {
                  connect: { order_id: parseInt(order_id) },
              },
                discount: {
                  connect: { discount_id: parseInt(discount_id) },
                },
                
            }
        });
        return NextResponse.json(created, {status: 201})    
    } catch (error) {
        console.log("Error creating Payment", error);
        return NextResponse.json(error, {status: 500});
    }
}

export async function PUT(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Check if a payment with this generated_code exists
    const payment = await prisma.payment.findFirst({
      where: {
        generated_code: code,
      },
      select: {
        payment_id: true,
        payment_method: true,
        payment_status: true,
        reference_no: true,
        account_number: true,
        account_name: true,
        cvv: true,
        expiry_date: true,
        amount: true,
        change: true,
        discount: {
          select: {
            discount_id: true,
            discount_name: true,
            discount_rate: true,
            status: true,
          },
        },
        order: {
          select: {
            order_id: true,
            customer_name: true,
            service_type: true,
            date: true,
            order_details: {
              select: {
                orderDetails_id: true,
                product: {
                  select: {
                    product_id: true,
                    product_name: true,
                    image_url: true,
                  },
                },
                quantity: true,
                price: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (payment) {
      return NextResponse.json(
        {
          valid: true,
          message: "Code is valid.",
          verifiedDetails: payment,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { valid: false, message: "Invalid code." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code." },
      { status: 500 }
    );
  }
}


