import React from 'react';

<<<<<<< HEAD
interface CardFormProps {
  payment: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

}

=======

interface CardFormProps {
  payment: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 
}


>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
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
<<<<<<< HEAD
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

=======
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
<<<<<<< HEAD
              type="month"
=======
              type="text"
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
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
<<<<<<< HEAD

=======
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
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CardForm;

=======

export default CardForm;
>>>>>>> 6c2cd4f6c4b8d97180acf025cfb0e637ee0f3a1f
