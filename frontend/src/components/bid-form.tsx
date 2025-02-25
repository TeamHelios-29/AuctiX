import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BidForm: React.FC = () => {
  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="auction-name" className="block font-medium mb-2">
          Auction Name
        </label>
        <Input id="auction-name" placeholder="Enter auction name" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-time" className="block font-medium mb-2">
            Start Time
          </label>
          <Input id="start-time" type="datetime-local" />
        </div>
        <div>
          <label htmlFor="end-time" className="block font-medium mb-2">
            End Time
          </label>
          <Input id="end-time" type="datetime-local" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="starting-price" className="block font-medium mb-2">
            Starting Price
          </label>
          <Input
            id="starting-price"
            type="number"
            placeholder="Enter starting price"
          />
        </div>
        <div>
          <label htmlFor="images" className="block font-medium mb-2">
            Images
          </label>
          <input
            id="images"
            type="file"
            multiple
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter description"
          className="w-full p-3 border rounded-md"
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <input id="make-public" type="checkbox" className="rounded" />
        <label htmlFor="make-public" className="text-sm text-gray-700">
          Make Listing Public
          <p className="text-xs text-gray-500">
            By making the listing public, users can view and participate in the
            auction.
          </p>
        </label>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" type="button" className="w-1/3">
          Cancel
        </Button>
        <Button className="w-1/3" variant="default" type="submit">
          Add Auction
        </Button>
      </div>
    </form>
  );
};

export default BidForm;
