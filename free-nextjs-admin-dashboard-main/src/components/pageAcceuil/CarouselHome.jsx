// src/components/pageAcceuil/ControlledCarousel.jsx
'use client';

import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
// Ensure Bootstrap CSS is imported, typically in your main layout or _app.js
// import 'bootstrap/dist/css/bootstrap.min.css';

// Custom Black Arrow Icons
const CustomPrevIcon = (
  <span aria-hidden="true" className="carousel-control-prev-icon d-flex justify-content-center align-items-center" style={{ filter: 'none' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" viewBox="0 0 16 16">
      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  </span>
);

const CustomNextIcon = (
  <span aria-hidden="true" className="carousel-control-next-icon d-flex justify-content-center align-items-center" style={{ filter: 'none' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" viewBox="0 0 16 16">
      <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  </span>
);


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Updated tabSliders with French captions and corrected second image URL
  const tabSliders = [
    {
      src: "https://res.cloudinary.com/dpcuxruyo/image/upload/v1746669054/home-hero-may-30_smpb8l.jpg",
      alt: "Slide 1: Soins de santé",
      captionTitle: "Les soins que vous méritez,",
      captionText: "par une équipe de confiance."
    },
    {
      // Corrected the second image URL
      src: "https://res.cloudinary.com/dpcuxruyo/image/upload/v1746669677/Schedule_Doctors_Office_ysciqq.jpg",
      alt: "Slide 2: Prise de rendez-vous",
      captionTitle: "Nous sommes là",
      captionText: "quand vous avez besoin de nous."
    },
    {
      src: "https://res.cloudinary.com/dpcuxruyo/image/upload/v1746669683/Get_Care_Now_llev9d.webp",
      alt: "Slide 3: Accès aux soins",
      captionTitle: "Votre santé,",
      captionText: "notre priorité absolue." // Added new caption
    },
  ];

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      interval={4000} // Slightly increased interval
      fade // Using fade transition
      className="w-full shadow-lg rounded-lg overflow-hidden"
      prevIcon={CustomPrevIcon} // Using custom black previous icon
      nextIcon={CustomNextIcon} // Using custom black next icon
    >
      {tabSliders.map((tab, i) => (
        <Carousel.Item key={i}>
          <div style={{
      
            height: '50vh', // Reduced height (e.g., 50% of viewport height)
            minHeight: '700px', // Minimum height
            maxHeight: '800px', // Maximum height for images
            overflow: 'hidden', // Ensures image stays within these bounds
          }}>
            <img
              className="d-block w-100"
              src={tab.src}
              alt={tab.alt || `Diapositive ${i + 1}`}
              style={{
                width: '100%',
                height: '100%', // Image fills the div height
                objectFit: 'cover', // Ensures image covers the area, might crop
              }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `https://placehold.co/1200x350/E2E8F0/4A5568?text=Erreur+Image`; // Fallback placeholder
                e.target.alt = "Erreur de chargement de l'image";
              }}
            />
          </div>
          <Carousel.Caption className="carousel-caption-custom bg-black bg-opacity-65 p-3 md:p-4 rounded">
            <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{tab.captionTitle}</h3>
            <p className="d-none d-sm-block text-sm md:text-base">{tab.captionText}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ControlledCarousel;
