import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link, Check, MessageCircle } from 'lucide-react';

const ShareProduct = ({ productName, productUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Check out this amazing spice: ${productName}`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 min-w-[200px]">
            <h4 className="font-semibold text-gray-900 mb-3">Share this product</h4>
            <div className="space-y-2">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-green-50 transition-colors text-green-600"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-400"
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-700"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 w-full text-left"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5" />}
                <span className={copied ? 'text-green-600' : ''}>{copied ? 'Copied!' : 'Copy link'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareProduct;
