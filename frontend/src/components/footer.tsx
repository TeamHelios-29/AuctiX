import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-800 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-8 lg:space-y-0">
        
        {/* Left Side (Brand & Socials) */}
        <div className="text-center lg:text-left space-y-7 w-full lg:w-auto">
          <h2 className="text-4xl font-bold text-black">
            Aucti<span className="text-yellow-500">X</span>
          </h2>
          <p className="text-sm text-gray-500">The Next Gen Auction experience!</p>
          {/* Social Icons */}
          <div className="flex justify-center lg:justify-start space-x-3 mt-2">
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 w-8 h-8 border border-gray-800 flex items-center justify-center">
              <Twitter className="text-gray-700 w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 w-8 h-8 border border-gray-800 flex items-center justify-center">
              <Facebook className="text-gray-700 w-5 h-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 w-8 h-8 border border-gray-800 flex items-center justify-center">
              <Instagram className="text-gray-700 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Footer Links (Grid Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm w-full lg:w-auto text-center lg:text-left">
          <div>
            <h3 className="font-semibold text-black">Company</h3>
            <ul className="mt-4 space-y-3 text-gray-500">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Career</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black">Help</h3>
            <ul className="mt-4 space-y-3 text-gray-500">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Customer Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Delivery Details</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black">FAQ</h3>
            <ul className="mt-4 space-y-3 text-gray-500">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Account</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Auctions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Transparency</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Payments</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-black">Resources</h3>
            <ul className="mt-4 space-y-3 text-gray-500">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Free eBooks</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">Development Tutorial</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">How to - Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition">YouTube Playlist</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-500">
        AuctiX © {new Date().getFullYear()} | Made with ❤️ by Helios
      </div>
    </footer>
  );
}
