import React from 'react';


interface CardFormProps {
  payment: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 
}


const CardForm: React.FC<CardFormProps> = ({ payment, handleChange }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Card Payment</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            name="account_number"
            value={payment.account_number}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              name="expiry_date"
              value={payment.expiry_date}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              name="cvv"
              value={payment.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
          <input
            type="text"
            name="account_name"
            value={payment.account_name}
            onChange={handleChange}
            placeholder="Taylor Swift"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};


export default CardForm;