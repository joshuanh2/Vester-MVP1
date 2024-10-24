import './styles.css';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Band from './Components/Band';
import { Suspense } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { grid } from 'ldrs'


// import instaIcon from './assets/instagram-icon.png';
import linkedinIcon from './assets/linkedin-icon.png';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  grid.register()

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

    const response = await fetch('https://script.google.com/macros/s/AKfycbx15a1HKKELxmX-Xeak5DsMK2OGwR-xJFYokmcLK7mEIUZRbrh5IsqEgimkhA99USVG/exec', {
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
    <div className="container">

      <div className={`content-wrapper ${showForm ? 'show-form' : ''}`}>
        <div className="content">

          <p className='heading-1'>Your ticket to ride is here</p>
          <p className='body-1'>You'll receive an email with all the logistical details shortly</p>

          <div className='share-container'>
            <p className='body-1'>SHARE ON</p>
            {/* <a href='instagram.com'><img src={instaIcon} alt=''></img></a> */}
            <a href='https://www.linkedin.com/company/thevester/' target="_blank" rel="noreferrer"><img src={linkedinIcon} alt=''></img></a>
          </div>

          <div className='content-footer'>
            <hr/>
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
          <form onSubmit={handleFormSubmit} className="sign-up-form">
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

      <div className={`canvas-wrapper ${isDragging ? 'dragging' : ''}`}>
        <Canvas className="canvas" camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={10} />
          { /*
          <directionalLight intensity={2} position={[-1, 0, 5]} />
          <directionalLight intensity={4} position={[8, 0, 5]} />
          <directionalLight intensity={2} position={[2, -4, 5]} />
          */ }
          <Physics gravity={[0, -40, 0]}>
            <Suspense fallback={null}>
              <Band setIsDragging={setIsDragging} />
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
  );
}

export default App;
