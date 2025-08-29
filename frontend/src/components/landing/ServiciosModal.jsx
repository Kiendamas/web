import {
  ShieldCheckIcon,
  SparklesIcon,
  MapIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LiaTaxiSolid } from 'react-icons/lia';
import { LuPlane } from 'react-icons/lu';
import { BsPeople } from 'react-icons/bs';

const servicios = [
  { icon: LuPlane, title: 'VIAJES A MEDIDA' },
  { icon: BsPeople, title: 'PAQUETES GRUPALES' },
  { icon: ShieldCheckIcon, title: 'SEGUROS' },
  { icon: SparklesIcon, title: 'EXPERIENCIAS TEMÁTICAS' },
  { icon: MapIcon, title: 'EXCURSIONES' },
  { icon: LiaTaxiSolid, title: 'TRASLADOS' },
];

const ServiciosModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-kiendamas-beige rounded-2xl shadow-2xl px-8 py-10 w-full max-w-lg mx-4 animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-kiendamas-darkest hover:text-kiendamas-gold transition-colors"
          onClick={onClose}
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h2 className="text-2xl font-bold text-kiendamas-darkest text-center mb-8 font-raleway tracking-wide">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {servicios.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-center justify-center p-4 rounded-xl bg-kiendamas-cream shadow hover:shadow-lg transition-all">
              <Icon className="h-10 w-10 text-kiendamas-gold mb-2" />
              <span className="text-kiendamas-darkest font-semibold text-center text-sm font-raleway">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiciosModal;
