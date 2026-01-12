export default function Footer() {
  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 py-3 px-4 z-50"
      role="contentinfo"
    >
      <div className="container mx-auto text-center">
        <p className="text-md text-gray-950">
          Made with{' '}
          <span className="text-gray-950" aria-label="love">❤️</span>
          {' '}by Nihad from{' '}
          <a 
            href="https://qapilot.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-950 hover:text-black font-bold underline decoration-gray-400 hover:decoration-black transition-colors"
            aria-label="Visit qapilot.io website"
          >
            QAPilot
          </a>
        </p>
      </div>
    </footer>
  );
}

