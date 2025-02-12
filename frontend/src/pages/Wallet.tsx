import React, { useState } from 'react';
import { DollarSign, MoreHorizontal } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  status: 'Success' | 'Pending';
  auction?: string;
  seller?: string;
  amount: number;
}

const WalletPage: React.FC = () => {
  const [balance] = useState(100000.0);
  const [frozenBalance] = useState(200.0);
  const [transactions] = useState<Transaction[]>([
    {
      id: 'T035',
      date: '2024-12-15',
      type: 'Credit',
      status: 'Success',
      amount: 5000.0,
    },
    {
      id: 'T001',
      date: '2024-12-15',
      type: 'Debit',
      status: 'Pending',
      auction: 'Mobile Phone',
      seller: 'John Doe',
      amount: 500.0,
    },
    {
      id: 'T035',
      date: '2024-12-15',
      type: 'Credit',
      status: 'Success',
      amount: 5000.0,
    },
    {
      id: 'T034',
      date: '2024-12-15',
      type: 'Debit',
      status: 'Success',
      auction: 'HDD',
      seller: 'John Doe',
      amount: 200.0,
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-normal text-gray-1000 mb-4">Wallet</h1>

      <div className="flex gap-20">
        {/* Wallet Card */}
        <div className="flex-1">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
            <div className="flex justify-between mb-2">
              <div className="space-x-2">
                <button className="px-8 py-4 bg-white rounded text-gray-700 hover:bg-gray-100 transition-colors">
                  Withdraw
                </button>
                <button className="px-8 py-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                  Recharge
                </button>
              </div>
              <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                <DollarSign className="w-16 h-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600">Your Balance</div>
              <div className="text-xl text-gray-700 flex ">
                <span className="text-gray-500 mr-2">LKR</span>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="mt-1 text-red-500 text-xs">
            You have {frozenBalance} coins of freezed balance
          </div>
        </div>

        {/* Wallet Image */}
        <div className="w-48">
          <img
            src="/walletimage.jpg"
            alt="Wallet illustration"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-12">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Transactions</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-200 rounded px-4 py-2 w-64 text-sm focus:outline-none focus:border-gray-300"
            />
            <button className="text-sm text-gray-600 px-2">
              Columns
              <span className="ml-1">▼</span>
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-600 text-left">
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4 font-normal">Transaction ID</th>
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal">Type</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Auction</th>
                  <th className="p-4 font-normal">Seller</th>
                  <th className="p-4 font-normal">Amount</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">{transaction.id}</td>
                    <td className="p-4">{transaction.date}</td>
                    <td className="p-4">
                      <span
                        className={
                          transaction.type === 'Credit'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-4">{transaction.status}</td>
                    <td className="p-4">{transaction.auction || '-'}</td>
                    <td className="p-4">{transaction.seller || '-'}</td>
                    <td className="p-4">
                      {transaction.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>4 of 100 row(s) selected</div>
            <div className="space-x-2">
              <button className="text-gray-600 hover:text-gray-800">
                Previous
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;