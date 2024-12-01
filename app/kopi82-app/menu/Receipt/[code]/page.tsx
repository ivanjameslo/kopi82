import React from 'react';

const ReceiptPage: React.FC = () => {
    const receiptData = {
        id: '12345',
        date: '2023-10-01',
        items: [
            { name: 'Coffee', quantity: 2, price: 5.0 },
            { name: 'Sandwich', quantity: 1, price: 7.5 },
        ],
        total: 17.5,
    };

    return (
        <div>
            <h1>Receipt</h1>
            <p>Receipt ID: {receiptData.id}</p>
            <p>Date: {receiptData.date}</p>
            <ul>
                {receiptData.items.map((item, index) => (
                    <li key={index}>
                        {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
            <h2>Total: ${receiptData.total.toFixed(2)}</h2>
        </div>
    );
};

export default ReceiptPage;