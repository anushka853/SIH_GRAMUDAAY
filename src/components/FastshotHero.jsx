import React, { useState, useEffect, useRef } from 'react';
import './FastshotHero.css';

export default function FastshotHero({ onStart }) {
  const containerRef = useRef(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Entrance animations
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    if (containerRef.current) {
      containerRef.current.classList.add('anim');
    }

    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove('anim');
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onStart) {
      onStart(input);
    }
  };

  return (
    <div className="fastshot-container" ref={containerRef}>
      <div className="fs-stage">
        <video 
          className="fs-stage-video" 
          autoPlay 
          muted 
          loop 
          playsInline 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4"
        />
        
        <div className="fs-frame">
          <input type="checkbox" id="fs-menu" hidden />
          
          <header className="fs-nav">
            <a href="#" aria-label="Fastshot home" className="fs-brand">
               <div className="fs-mark"><div className="fs-mark-inner"></div></div>
               <span className="fs-brand-text">Fastshot</span>
            </a>
            <nav className="fs-links">
              <a href="#">Features</a>
              <a href="#">Examples</a>
              <a href="#">Pricing</a>
              <a href="#">Docs</a>
            </nav>
            <a href="#" className="fs-cta" onClick={(e) => { e.preventDefault(); onStart && onStart(''); }}>
              <span>Get Started</span>
            </a>
            
            <label htmlFor="fs-menu" className="fs-burger">
              <svg viewBox="0 0 17 12" width="17" height="12" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M0 2h17M0 10h17"/></svg>
            </label>
          </header>

          <div className="fs-sheet">
            <div className="fs-sheet-inner">
              <a href="#">Features</a>
              <a href="#">Examples</a>
              <a href="#">Pricing</a>
              <a href="#">Docs</a>
              <a href="#" className="fs-m-start" onClick={(e) => { e.preventDefault(); onStart && onStart(''); }}>Get Started</a>
            </div>
          </div>
          
          <main className="fs-hero">
            <h1 className="fs-h1">Describe an app. We'll build it.</h1>
            <form className="fs-card" onSubmit={handleSubmit}>
              <input 
                type="text" 
                className="fs-ph" 
                placeholder="Build a fintech tracking app with bank level privacy and..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              
              <div className="fs-tools">
                <div className="fs-chips">
                   <div className="fs-chip" style={{ '--cw': 107, '--pl': 12, '--ig': 3.7 }}>
                     <svg style={{ width: 'calc(15.06 * var(--u))' }} viewBox="0 0 16 16"><path fill="currentColor" d="M2 2h12v12H2V2z"/></svg>
                     <span>Attach Screens</span>
                   </div>
                   <div className="fs-chip" style={{ '--cw': 108, '--pl': 16, '--ig': 3.9 }}>
                     <svg style={{ width: 'calc(11.8 * var(--u))' }} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="currentColor"/></svg>
                     <span>Attach a Figma</span>
                   </div>
                   <div className="fs-chip" style={{ '--cw': 107, '--pl': 15.8, '--ig': 2.9 }}>
                     <svg style={{ width: 'calc(12.13 * var(--u))' }} viewBox="0 0 16 16"><path fill="currentColor" d="M8 2l6 12H2z"/></svg>
                     <span>Today's Theme</span>
                   </div>
                </div>
                <div className="fs-right">
                   <div className="fs-model">
                     <span>Sonnet 4.5</span>
                     <svg viewBox="0 0 12 12"><path fill="currentColor" d="M2 4l4 4 4-4z"/></svg>
                   </div>
                   <div className="fs-attach">
                     <svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 8v8a4 4 0 0 1-8 0V7a2.5 2.5 0 0 1 5 0v8a1 1 0 0 1-2 0V8h-2v7a3 3 0 0 0 6 0V7a4.5 4.5 0 0 0-9 0v9a6 6 0 0 0 12 0V8h-2z"/></svg>
                   </div>
                   <button type="submit" className="fs-send" aria-label="Build it">
                     <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l-8 10h5v10h6V12h5L12 2z"/></svg>
                   </button>
                </div>
              </div>
            </form>
          </main>

          <footer className="fs-proof">
            <p>Built by engineers from</p>
            <div className="fs-logos">
               <svg className="fs-google" viewBox="0 0 100 30"><text y="22" fontFamily="sans-serif" fontWeight="bold" fontSize="28" fill="currentColor">Google</text></svg>
               <svg className="fs-cisco" viewBox="0 0 100 30"><text y="22" fontFamily="sans-serif" fontWeight="bold" fontSize="28" fill="currentColor">Cisco</text></svg>
               <svg className="fs-adobe" viewBox="0 0 100 30"><text y="22" fontFamily="sans-serif" fontWeight="bold" fontSize="28" fill="currentColor">Adobe</text></svg>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
