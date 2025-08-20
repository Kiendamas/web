import React from 'react';

const iconList = [
  { src: '/Redes.png', alt: 'Facebook', link: 'https://facebook.com' },
  { src: '/Instagram.png', alt: 'Instagram', link: 'https://www.instagram.com/kiendamas_viajes/' },
  { src: '/youtube.png', alt: 'YouTube', link: 'https://youtube.com' },
];

const SocialMediaFixed = () => (
  <div
    style={{
      position: 'fixed',
      top: '314px',
      right: 0,
      width: 48,
      height: 140,
      background: '#FF625E',
      opacity: 1,
      padding: '10px 10px',
      gap: 8,
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}
    className="social-media-fixed"
  >
    {iconList.map((icon) => (
      <a
        key={icon.alt}
        href={icon.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginBottom: 10, display: 'flex' }}
      >
        <img src={icon.src} alt={icon.alt} style={{ width: 26, height: 26 }} />
      </a>
    ))}
  </div>
);

export default SocialMediaFixed;

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
