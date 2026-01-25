import { Lightbulb } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="bg-linear-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">BuildNet</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Empowering innovators to collaborate and build amazing projects together.
            </p>
          </div>

          {/* Product Section */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
            <div className="space-y-2 text-gray-400 text-sm sm:text-base">
              <div className="hover:text-white transition cursor-pointer">Features</div>
              <div className="hover:text-white transition cursor-pointer">Pricing</div>
              <div className="hover:text-white transition cursor-pointer">Use Cases</div>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <div className="space-y-2 text-gray-400 text-sm sm:text-base">
              <div className="hover:text-white transition cursor-pointer">About</div>
              <div className="hover:text-white transition cursor-pointer">Blog</div>
              <div className="hover:text-white transition cursor-pointer">Careers</div>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <div className="space-y-2 text-gray-400 text-sm sm:text-base">
              <div className="hover:text-white transition cursor-pointer">Help Center</div>
              <div className="hover:text-white transition cursor-pointer">Contact</div>
              <div className="hover:text-white transition cursor-pointer">Privacy Policy</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          © 2026 BuildNet. Made with ❤️ by Adnan Pal
        </div>
      </div>
    </footer>
  );
}

export default Footer;