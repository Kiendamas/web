import { FaWhatsapp } from 'react-icons/fa';

const SocialWhatsappFixed = () => (
  <a
    href="https://wa.me/5493415858303"
    target="_blank"
    rel="noopener noreferrer"
  className="fixed left-3 bottom-8 z-[10000] flex items-center justify-center w-14 h-14 rounded-full border-2 border-white bg-kiendamas-darkBrown shadow-lg transition hover:scale-110 animate-bounce-custom animate-shadow-glow"
  >
    <FaWhatsapp size={30} color="#fff" />
  </a>
);

export default SocialWhatsappFixed;
