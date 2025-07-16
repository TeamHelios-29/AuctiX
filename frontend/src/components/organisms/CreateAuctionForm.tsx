import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosInstance } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import AxiosRequest from '@/services/axiosInspector';

interface AuctionUpdateFormDTO {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  isPublic: boolean;
  category: string;
  images: string[]; // image IDs or URLs depending on backend
  hasBids: boolean;
  canFullyEdit: boolean;
}

const AuctionForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImageIds, setExistingImageIds] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [canFullyEdit, setCanFullyEdit] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !startTime || !endTime) {
      toast.error('All fields are required');
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

      const endpoint = isEditMode
        ? `/auctions/update/${id}`
        : '/auctions/create';
      const method = isEditMode ? 'put' : 'post';

      const response = await axiosInstance.request({
        method,
        url: endpoint,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(
        isEditMode
          ? 'Auction updated successfully!'
          : 'Auction created successfully!',
      );
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      toast.error('Something went wrong.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      axiosInstance.get(`/auctions/update/${id}`).then((res) => {
        const data: AuctionUpdateFormDTO = res.data;
        setTitle(data.title);
        setDescription(data.description);
        setStartingPrice(data.startingPrice);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setIsPublic(data.isPublic);
        setCategory(data.category);
        setExistingImageIds(data.images);
        setCanFullyEdit(data.canFullyEdit);
      });
    }
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 5) {
        toast.error('You can upload a maximum of 5 images');
        return;
      }
      setImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-2">Product Name</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isEditMode && !canFullyEdit}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Auction Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isEditMode && !canFullyEdit}
          className="w-full p-3 border rounded-md"
          required
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Art">Art</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2">Start Time</label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isEditMode && !canFullyEdit}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">End Time</label>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isEditMode && !canFullyEdit}
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Starting Price</label>
        <Input
          type="number"
          value={startingPrice}
          onChange={(e) => setStartingPrice(parseFloat(e.target.value))}
          disabled={isEditMode && !canFullyEdit}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          accept="image/*"
          disabled={isEditMode && !canFullyEdit}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {existingImageIds.map((id, idx) => (
            <div key={`existing-${idx}`} className="relative">
              <img
                src={`http://localhost:8080/api/uploads/${id}`}
                alt="existing"
                className="w-16 h-16 object-cover rounded-md"
              />
            </div>
          ))}
          {images.map((file, idx) => (
            <div key={`upload-${idx}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center"
                onClick={() => removeImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-md"
          required
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label>Make Public</label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Submitting...'
          : isEditMode
            ? 'Update Auction'
            : 'Add Auction'}
      </Button>
    </form>
  );
};

export default AuctionForm;
