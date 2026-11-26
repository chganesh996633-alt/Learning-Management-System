import { useEffect } from 'react';
import legacyMarkup from './legacy.html?raw';
import './legacy.css'; 

/*
  Migration bridge:
  React mounts the existing EduLearn markup. The original CSS and DOM-based
  JavaScript are retained so the current LMS behavior and design are preserved
  while the project is moved into a Vite + React setup.
*/
function App() {
  useEffect(() => {
    if (window.__EDULEARN_LEGACY_SCRIPT_LOADING__) return;

    window.__EDULEARN_LEGACY_SCRIPT_LOADING__ = true;

    const script = document.createElement('script');
    script.src = `${import.meta.env.BASE_URL}legacy.js`;
    script.async = false;
    script.onerror = () => {
      console.error('Could not load the EduLearn legacy JavaScript.');
      window.__EDULEARN_LEGACY_SCRIPT_LOADING__ = false;
    };
    document.body.appendChild(script);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: legacyMarkup }} />;
}

export default App;