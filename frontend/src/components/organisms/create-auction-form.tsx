import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuctionForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !startingPrice || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('startingPrice', startingPrice.toString());
      formData.append('startTime', new Date(startTime).toISOString());
      formData.append('endTime', new Date(endTime).toISOString());
      formData.append('isPublic', isPublic.toString());
      formData.append('category', category);
      images.forEach((image) => formData.append('images', image));

      const response = await axios.post('/api/auctions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Auction created successfully!');
        navigate('/auctions');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      toast.error('Failed to create auction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 5) {
        toast.error('You can upload a maximum of 5 images');
        return;
      }
      setImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block font-medium mb-2">
          Product Name
        </label>
        <Input
          id="title"
          placeholder="Enter product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium mb-2">
          Auction Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-md"
          required
        >
          <option value="">Select a category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Garden</option>
          <option value="art">Art</option>
          <option value="other">Other</option>
        </select>
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
            Images (Max 5)
          </label>
          <input
            id="images"
            type="file"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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

export default AuctionForm;
