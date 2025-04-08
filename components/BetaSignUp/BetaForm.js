// "use client";

import './BetaForm.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Image from "next/image";
import Band from './Band';
import { Suspense } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { grid } from 'ldrs'
import { tailspin } from 'ldrs'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';



// import instaIcon from './assets/instagram-icon.png';
import linkedinIcon from './Assets/linkedin-icon.png';

function BetaForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  grid.register()
  tailspin.register()

  // Check if screen width is less than 1000px
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Scroll to bottom when component first loads
  useEffect(() => {
    /* 
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    }); */

    // Lets the page load before showing all the content
    // Skip loading animation for mobile devices
    if (window.innerWidth < 1000) {
      setIsPageLoading(false);
    } else {
      const timer = setTimeout(() => {
          setIsPageLoading(false);
      }, 1000);
    
      // Cleanup timer if component unmounts before timeout completes
      return () => clearTimeout(timer);
    }
  }, []);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowForm(false);
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      source: formData.get('source'),
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbyWwXpcqFqlbGa3d6zfYZSrwd1SGXgaaNHWxsCNJ4ODrZIFPBSD7MIMYm4FmKcEpoGQ/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    setIsLoading(false);

    if (response.ok) {
      setFormSent(true);
      console.log('Form submitted successfully');
    } else {
      console.error('Error submitting form');
      console.log(response)
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${isMobile ? 'mobile-scrollable' : ''}`}>
    <div className="w-full h-full flex flex-col relative">
        
      {isPageLoading && !isMobile && (
        <div className="loader-container">
          <div className="page-loader">
            <l-tailspin size="100" speed="0.9" stroke='15' color="white"></l-tailspin>
          </div>
        </div>
      )}

      {!isMobile && (
      <button
        onClick={() => router.push('/')} // Navigate back to the main page
        className="fixed top-4 left-4 bg-none hover:bg-transparent text-white font-semibold py-2 px-4 rounded flex items-center z-20"
      >
        <ArrowLeft className="h-5 w-5 mr-1" /> {/* Icon */}
        Back
      </button>
      )}

      <div className={`content-wrapper ${showForm ? 'show-form' : ''} w-full h-full ${isMobile ? 'mobile-view' : ''}`}>
        <div className={`content ${isMobile ? 'mobile-content' : ''}`}>
          {isMobile && (
            <div className="mobile-logo-container">
              <Image 
                src="/vester-logo-short.svg" 
                alt="Vester Logo" 
                width={120} 
                height={40} 
                className="mobile-logo"
              />
            </div>
          )}

          <p className='heading-1'>Your ticket to ride is here</p>
          <p className='body-1'>You'll receive an email with all the details shortly</p>

          <div className='share-container'>
            <p className='body-1'>FOLLOW US</p>
            {/* <a href='instagram.com'><img src={instaIcon} alt=''></img></a> */}
            <a href='https://www.linkedin.com/company/vesterai/' target="_blank" rel="noreferrer">
              <Image
                src="/assets/linkedin-icon.png"
                alt="LinkedIn Icon"
                width={20}
                height={20}
              />
            </a>
          </div>

          <div className='content-footer'>
            <hr className='mb-3'/>
            {isLoading ? (
              <div className='loader'>
                <l-grid
                  size="60"
                  speed="0.9" 
                  color="white" 
                ></l-grid>
              </div>
            ) : !formSent && !showForm ? (
              <>
                <p className="body-1">Sign up for the Vester Beta here</p>
                <button className="sign-up-btn" onClick={handleButtonClick}>RESERVE YOUR SPOT</button>
              </>
            ) : null}
          </div>
        </div>

        {showForm && !formSent && (
          <form onSubmit={handleFormSubmit} className={`sign-up-form ${isMobile ? 'mobile-form' : ''}`}>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <label>
              How did you hear about us?
              <input type="text" name="source" required />
            </label>
            <button type="submit" className="submit-btn">Sign Up for Vester Beta</button>
          </form>
        )}

        {formSent && (
          <div className="thank-you-message">
            <p className='heading-2'>Thanks for signing up, stay tuned!</p>
          </div>
        )}
      </div>

      {/* Always show the canvas as background, but only render the Band component when not mobile */}
      <div className={`canvas-wrapper ${isDragging ? 'dragging' : ''} w-screen h-screen`}>
        <Canvas className="canvas w-screen h-screen" camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={10} />
          { /*
          <directionalLight intensity={2} position={[-1, 0, 5]} />
          <directionalLight intensity={4} position={[8, 0, 5]} />
          <directionalLight intensity={2} position={[2, -4, 5]} />
          */ }
          <Physics gravity={[0, -40, 0]}>
            <Suspense fallback={null}>
              {!isMobile && <Band setIsDragging={setIsDragging} />}
            </Suspense>
          </Physics>
          <Environment background blur={0.75}>
            <color attach="background" args={['black']} />
            <Lightformer intensity={0.5} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={1} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Canvas>
      </div>
    </div>
    </div>
  );
}

export default BetaForm;
