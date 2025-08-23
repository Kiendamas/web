import React, { useRef, useState, useEffect } from 'react';

// Componente para animar el título de categoría al entrar en vista
function CategoryTitleAnimated({ tituloBg, categoriaNombre }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mb-10">
      <div
        ref={ref}
        className={`${tituloBg} rounded-r-3xl pl-4 sm:pl-6 pr-8 py-3 max-w-xs sm:max-w-md shadow-[0_4px_24px_0_#89898930] border border-[#89898930] ${visible ? 'animate-slide-in-left' : 'opacity-0'}`}
        style={{ overflow: 'hidden', transition: 'opacity 0.3s' }}
      >
        <h2 className="font-raleway font-normal text-xl sm:text-2xl text-[#646464]">
          Paquetes {categoriaNombre}
        </h2>
      </div>
    </div>
  );
}

export default CategoryTitleAnimated;
