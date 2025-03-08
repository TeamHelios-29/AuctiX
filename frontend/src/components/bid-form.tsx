import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BidForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !startingPrice || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const bidData = {
        title,
        description,
        startingPrice,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        isPublic,
      };

      const response = await axios.post('/api/bids', bidData);

      if (response.status === 201) {
        toast.success('Bid created successfully!');
        navigate('/bids');
      }
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error('Failed to create bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block font-medium mb-2">
          Auction Name
        </label>
        <Input
          id="title"
          placeholder="Enter auction name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-time" className="block font-medium mb-2">
            Start Time
          </label>
          <Input
            id="start-time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="end-time" className="block font-medium mb-2">
            End Time
          </label>
          <Input
            id="end-time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
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
            value={startingPrice}
            onChange={(e) => setStartingPrice(parseFloat(e.target.value))}
            required
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
            onChange={(e) => setImages(e.target.files)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md"
          required
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="make-public"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="make-public" className="text-sm text-gray-700">
          Make Listing Public
          <p className="text-xs text-gray-500">
            By making the listing public, users can view and participate in the
            auction.
          </p>
        </label>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          type="button"
          className="w-1/3"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button
          className="w-1/3"
          variant="default"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Add Auction'}
        </Button>
      </div>
    </form>
  );
};

export default BidForm;
