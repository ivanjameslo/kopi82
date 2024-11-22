import prisma from "@/lib/db";

async function main() {
    // Seed products
    await prisma.product.createMany({
        data: [
            {
                category: 'Coffee',
                product_name: 'Latte',
                type: 'Hot',
                hotPrice: 3.5,
                icedPrice: 4.0,
                frappePrice: 4.5,
                singlePrice: 3.0,
                status: 'Available',
                description: 'A delicious hot latte',
                image_url: 'https://example.com/latte.jpg',
            },
            {
                category: 'Coffee',
                product_name: 'Cappuccino',
                type: 'Hot',
                hotPrice: 3.0,
                icedPrice: 3.5,
                frappePrice: 4.0,
                singlePrice: 2.5,
                status: 'Available',
                description: 'A rich cappuccino',
                image_url: 'https://example.com/cappuccino.jpg',
            },
            {
                category: 'Coffee',
                product_name: 'Espresso',
                type: 'Hot',
                hotPrice: 2.5,
                icedPrice: 3.0,
                frappePrice: 3.5,
                singlePrice: 2.0,
                status: 'Available',
                description: 'A strong espresso',
                image_url: 'https://example.com/espresso.jpg',
            },
            {
                category: 'Coffee',
                product_name: 'Mocha',
                type: 'Hot',
                hotPrice: 4.0,
                icedPrice: 4.5,
                frappePrice: 5.0,
                singlePrice: 3.5,
                status: 'Available',
                description: 'A chocolatey mocha',
                image_url: 'https://example.com/mocha.jpg',
            },
            {
                category: 'Coffee',
                product_name: 'Americano',
                type: 'Hot',
                hotPrice: 2.0,
                icedPrice: 2.5,
                frappePrice: 3.0,
                singlePrice: 1.5,
                status: 'Available',
                description: 'A classic americano',
                image_url: 'https://example.com/americano.jpg',
            },
        ],
    });

    // Seed orders
    await prisma.order.createMany({
        data: [
            {
                customer_name: 'Alice',
                service_type: 'Dine-in',
                date: new Date(new Date().setDate(new Date().getDate() - 1)),
            },
            {
                customer_name: 'Bob',
                service_type: 'Takeaway',
                date: new Date(new Date().setDate(new Date().getDate() - 2)),
            },
            {
                customer_name: 'Charlie',
                service_type: 'Delivery',
                date: new Date(new Date().setDate(new Date().getDate() - 3)),
            },
            {
                customer_name: 'David',
                service_type: 'Dine-in',
                date: new Date(new Date().setDate(new Date().getDate() - 4)),
            },
            {
                customer_name: 'Eve',
                service_type: 'Takeaway',
                date: new Date(new Date().setDate(new Date().getDate() - 5)),
            },
            {
                customer_name: 'Frank',
                service_type: 'Delivery',
                date: new Date(new Date().setDate(new Date().getDate() - 6)),
            },
            {
                customer_name: 'Grace',
                service_type: 'Dine-in',
                date: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
            {
                customer_name: 'Hank',
                service_type: 'Takeaway',
                date: new Date(new Date().setDate(new Date().getDate() - 8)),
            },
            {
                customer_name: 'Ivy',
                service_type: 'Delivery',
                date: new Date(new Date().setDate(new Date().getDate() - 9)),
            },
            {
                customer_name: 'Jack',
                service_type: 'Dine-in',
                date: new Date(new Date().setDate(new Date().getDate() - 10)),
            },
            {
                customer_name: 'Karen',
                service_type: 'Dine-in',
                date: new Date(),
            },
            {
                customer_name: 'Leo',
                service_type: 'Takeaway',
                date: new Date(),
            },
            {
                customer_name: 'Mona',
                service_type: 'Delivery',
                date: new Date(),
            },
            {
                customer_name: 'Nina',
                service_type: 'Dine-in',
                date: new Date(new Date().setDate(new Date().getDate() - 11)),
            },
            {
                customer_name: 'Oscar',
                service_type: 'Takeaway',
                date: new Date(new Date().setDate(new Date().getDate() - 12)),
            },
        ],
    });

    // Seed order details
    await prisma.order_details.createMany({
        data: [
            {
                order_id: 1,
                product_id: 1,
                quantity: 2,
            },
            {
                order_id: 1,
                product_id: 3,
                quantity: 1,
            },
            {
                order_id: 2,
                product_id: 2,
                quantity: 1,
            },
            {
                order_id: 2,
                product_id: 4,
                quantity: 2,
            },
            {
                order_id: 3,
                product_id: 3,
                quantity: 3,
            },
            {
                order_id: 3,
                product_id: 5,
                quantity: 1,
            },
            {
                order_id: 4,
                product_id: 4,
                quantity: 1,
            },
            {
                order_id: 4,
                product_id: 1,
                quantity: 2,
            },
            {
                order_id: 5,
                product_id: 5,
                quantity: 2,
            },
            {
                order_id: 5,
                product_id: 2,
                quantity: 1,
            },
            {
                order_id: 6,
                product_id: 1,
                quantity: 1,
            },
            {
                order_id: 6,
                product_id: 3,
                quantity: 2,
            },
            {
                order_id: 7,
                product_id: 2,
                quantity: 2,
            },
            {
                order_id: 7,
                product_id: 4,
                quantity: 1,
            },
            {
                order_id: 8,
                product_id: 3,
                quantity: 1,
            },
            {
                order_id: 8,
                product_id: 5,
                quantity: 2,
            },
            {
                order_id: 9,
                product_id: 4,
                quantity: 2,
            },
            {
                order_id: 9,
                product_id: 1,
                quantity: 1,
            },
            {
                order_id: 10,
                product_id: 5,
                quantity: 1,
            },
            {
                order_id: 10,
                product_id: 2,
                quantity: 2,
            },
            {
                order_id: 11,
                product_id: 1,
                quantity: 1,
            },
            {
                order_id: 11,
                product_id: 3,
                quantity: 2,
            },
            {
                order_id: 12,
                product_id: 2,
                quantity: 1,
            },
            {
                order_id: 12,
                product_id: 4,
                quantity: 2,
            },
            {
                order_id: 13,
                product_id: 3,
                quantity: 3,
            },
            {
                order_id: 13,
                product_id: 5,
                quantity: 1,
            },
            {
                order_id: 14,
                product_id: 4,
                quantity: 1,
            },
            {
                order_id: 14,
                product_id: 1,
                quantity: 2,
            },
            {
                order_id: 15,
                product_id: 5,
                quantity: 2,
            },
            {
                order_id: 15,
                product_id: 2,
                quantity: 1,
            },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });