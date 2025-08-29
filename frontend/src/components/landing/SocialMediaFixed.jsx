import React from 'react';

const iconList = [
  { src: '/Redes.png', alt: 'Facebook', link: 'https://facebook.com' },
  { src: '/Instagram.png', alt: 'Instagram', link: 'https://www.instagram.com/kiendamas_viajes/' },
  { src: '/youtube.png', alt: 'YouTube', link: 'https://youtube.com' },
];

const SocialMediaFixed = () => (
  <div
    className="social-media-fixed-custom bg-kiendamas-coral "
    style={{ width: 40, padding: '8px 6px', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 }}
  >
    {iconList.map((icon) => (
      <div
        key={icon.alt}
        className="group flex items-center mb-2 last:mb-0 relative "
        style={{ minHeight: 28, cursor: 'pointer' }}
      >
        <span
          className="absolute right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 bg-kiendamas-beige text-kiendamas-darkest font-semibold px-2 py-1 rounded shadow text-xs select-none"
          style={{whiteSpace:'nowrap', zIndex: 10}}
        >
          {icon.alt}
        </span>
        <a
          href={icon.link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
          aria-label={icon.alt}
          className="flex items-center"
          style={{ zIndex: 20 }}
        >
          <img
            src={icon.src}
            alt={icon.alt}
            className="w-6 h-6 rounded-full shadow bg-kiendamas-beige transition-transform duration-300 group-hover:-translate-x-2 group-hover:scale-110 hover:ring-2 hover:ring-kiendamas-gold"
          />
        </a>
      </div>
    ))}
  </div>
);


export default SocialMediaFixed;

// CSS para responsive y hover (agrega esto en tu CSS global o en el archivo correspondiente):
/*
@media (max-width: 768px) {
  .social-media-fixed {
    top: auto !important;
    bottom: 12px !important;
    right: 0 !important;
    width: 36px !important;
    height: auto !important;
    padding: 6px 4px !important;
    border-radius: 12px 0 0 12px !important;
    gap: 6px !important;
  }
  .social-media-fixed a img {
    width: 14px !important;
    height: 14px !important;
  }
}

.social-media-fixed a img {
  transition: transform 0.22s cubic-bezier(0.4, 1.4, 0.6, 1.1), box-shadow 0.22s;
}
.social-media-fixed a:hover img {
  transform: scale(1.28) rotate(-6deg);
  box-shadow: 0 4px 16px 0 #fff3, 0 0 0 2px #fff6;
  z-index: 2;
}
*/

// CSS para responsive (agrega esto en tu CSS global o en el archivo correspondiente):
/*
@media (max-width: 768px) {
  .social-media-fixed {
    top: auto !important;
    bottom: 12px !important;
    right: 0 !important;
    width: 36px !important;
    height: auto !important;
    padding: 6px 4px !important;
    border-radius: 12px 0 0 12px !important;
    gap: 6px !important;
  }
  .social-media-fixed a img {
    width: 14px !important;
    height: 14px !important;
  }
}
*/
