import { Link } from 'react-scroll';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import logo from '@/images/logoCM.png';
import { AlignJustify } from 'lucide-react';

const MenuWeb = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <div className="flex justify-between items-center max-w-screen-lg mx-auto px-4">
      <motion.h1
        className="text-2xl font-bold flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={logo}
          alt="Logo RTL Rolamentos"
          className="w-56 h-auto object-cover"
        />
      </motion.h1>
      <nav className="hidden md:flex space-x-6">
        <Link to="home" smooth={true} duration={500}>
          <Button variant="ghost" className="text-[16px]">
            Home
          </Button>
        </Link>
        <Link to="servicos" smooth={true} duration={500}>
          <Button variant="ghost" className="text-[16px]">
            Serviços
          </Button>
        </Link>
        <Link to="pecas" smooth={true} duration={500}>
          <Button variant="ghost" className="text-[16px]">
            Peças disponíveis
          </Button>
        </Link>
        <Link to="contato" smooth={true} duration={500}>
          <Button variant="ghost" className="text-[16px]">
            Contato
          </Button>
        </Link>
      </nav>
      {/* Menu móvel */}
      <div className="md:hidden">
        <Button variant="ghost" onClick={toggleMenu}>
          <AlignJustify size={30} />
        </Button>
      </div>
    </div>
  );
};

export default MenuWeb;
