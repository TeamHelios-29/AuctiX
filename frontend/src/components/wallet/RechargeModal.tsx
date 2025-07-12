import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecharge: (amount: number) => void;
  isLoading: boolean;
}

const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onRecharge,
  isLoading,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount');
    } else {
      setError('');
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value);
    setError('');
  };

  const handleSubmit = () => {
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    onRecharge(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recharge Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount (LKR)
          </label>
          <input
            type="number"
            id="amount"
            value={amount || ''}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter amount"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleQuickAmount(100)}
            className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors"
          >
            100
          </button>
          <button
            onClick={() => handleQuickAmount(500)}
            className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors"
          >
            500
          </button>
          <button
            onClick={() => handleQuickAmount(1000)}
            className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors"
          >
            1,000
          </button>
          <button
            onClick={() => handleQuickAmount(5000)}
            className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors"
          >
            5,000
          </button>
          <button
            onClick={() => handleQuickAmount(10000)}
            className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors"
          >
            10,000
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || amount <= 0}
            className="flex-1 px-4 py-2 bg-amber-600 border border-yellow-200 rounded text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Recharge'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RechargeModal;
