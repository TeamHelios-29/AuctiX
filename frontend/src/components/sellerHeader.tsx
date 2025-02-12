import { CheckCircle } from "lucide-react";

export default function SellerHeader() {
  return (
    <div className="bg-white p-4 flex items-center justify-between shadow-md rounded-lg border">
      <div className="flex items-center gap-4">
        <img
          src="exampleAvatar.png"
          alt="Seller"
          className="w-12 h-12 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            Sam Perera <CheckCircle className="text-green-500 w-5 h-5 ml-1" />
          </h2>
          <p className="text-yellow-500 text-sm">★★★★★</p>
        </div>
      </div>
      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-800">
        Report Seller
      </button>
    </div>
  );
}
