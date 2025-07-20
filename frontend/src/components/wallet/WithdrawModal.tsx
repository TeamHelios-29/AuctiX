import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (data: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  }) => void;
  maxAmount: number;
  isLoading: boolean;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  maxAmount,
  isLoading,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed your available balance (${maxAmount})`;
    }

    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onWithdraw({
        amount,
        bankName,
        accountNumber,
        accountHolderName,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Withdraw Funds
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="withdraw-amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (LKR)
            </label>
            <input
              type="number"
              id="withdraw-amount"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Available: LKR{' '}
              {maxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <label
              htmlFor="bank-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter bank name"
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="account-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter account number"
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="account-holder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Holder Name
            </label>
            <input
              type="text"
              id="account-holder"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter account holder name"
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountHolderName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-amber-600 border border-yellow-200 rounded text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
