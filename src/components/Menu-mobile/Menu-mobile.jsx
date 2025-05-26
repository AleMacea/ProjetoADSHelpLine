import { Link } from 'react-scroll';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const MenuMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 ${isMenuOpen ? 'block' : 'hidden'}`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <Link to="home" smooth={true} duration={500} onClick={toggleMenu}>
          <Button variant="ghost" className="text-white text-2xl mb-4">
            Home
          </Button>
        </Link>
        <Link to="servicos" smooth={true} duration={500} onClick={toggleMenu}>
          <Button variant="ghost" className="text-white text-2xl mb-4">
            Peças disponíveis
          </Button>
        </Link>
        <Link to="contato" smooth={true} duration={500} onClick={toggleMenu}>
          <Button variant="ghost" className="text-white text-2xl mb-4">
            Contato
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MenuMobile;
