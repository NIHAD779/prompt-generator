import Image from 'next/image';

interface FooterProps {
  onLogoClick?: () => void;
}

export default function Footer({ onLogoClick }: FooterProps) {
  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 py-0.5 px-4 sm:py-1 sm:px-3 z-50 safe-area-bottom"
      role="contentinfo"
    >
      <div className="max-w-4xl mx-auto flex flex-row justify-between items-center gap-1 sm:gap-2">
        {/* Left Side - Logo and Brand */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Go to home screen"
        >
          <Image 
            src="/icon.png" 
            alt="Heal My Prompt Logo" 
            width={32} 
            height={32}
            className="w-4 h-4 sm:w-6 sm:h-6 rounded-md"
          />
          <span className="text-sm sm:text-lg font-bold text-black">Heal My Prompt</span>
        </button>
        
        {/* Right Side - Attribution */}
        <p className="text-md sm:text-base text-gray-950 leading-tight sm:leading-relaxed">
          Made with{' '}
          <span className="text-gray-950" aria-label="love">❤️</span>
          {' '}by{' '}
          <a 
            href="https://www.linkedin.com/in/muhammed-nihad-u-813357212/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-950 hover:text-black font-bold decoration-gray-400 hover:decoration-black transition-colors"
            aria-label="Visit Nihad's LinkedIn profile"
          >
            Nihad
          </a>
          {' '}from{' '}
          <a 
            href="https://qapilot.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-950 hover:text-black font-bold transition-colors"
            aria-label="Visit qapilot.io website"
          >
            QApilot
          </a>
        </p>
      </div>
    </footer>
  );
}

