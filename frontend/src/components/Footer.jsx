import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} Internship Portal. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by Your Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
