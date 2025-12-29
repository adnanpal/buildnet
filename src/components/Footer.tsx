import { Lightbulb } from "lucide-react";
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-linear-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BuildNet</span>
            </div>
            <p className="text-gray-400">Empowering innovators to collaborate and build amazing projects together.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <div className="space-y-2 text-gray-400">
              <div>Features</div>
              <div>Pricing</div>
              <div>Use Cases</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <div className="space-y-2 text-gray-400">
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <div className="space-y-2 text-gray-400">
              <div>Help Center</div>
              <div>Contact</div>
              <div>Privacy Policy</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          © 2025 BuildNet. Made with❤️by Adnan Pal
        </div>
      </div>
    </footer>
  );
}
export default Footer;