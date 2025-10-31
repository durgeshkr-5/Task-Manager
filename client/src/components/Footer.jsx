import React from "react";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner border-t border-gray-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-gray-700">
        {/* Left Section */}
        <p className="text-sm font-medium mb-3 sm:mb-0">
          © {new Date().getFullYear()} <span className="font-semibold">Durgesh Kumar</span>
        </p>

        {/* Right Section (Social Links) */}
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/durgeshkr5/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-all"
            title="LinkedIn"
          >
            <Linkedin size={22} />
          </a>

          <a
            href="https://github.com/durgeshkr-5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-all"
            title="GitHub"
          >
            <Github size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
