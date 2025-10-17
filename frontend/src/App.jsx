import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import TextPressure from './TextPressure';
import CircularGallery from './CircularGallery';
// import FlowingMenu from './FlowingMenu';
import ProfileCard from './ProfileCard';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optionally unobserve after reveal to improve perf
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <div className="hero">
      <nav className="navbar">
        <h2 className="logo">Play2Learn</h2>
        <ul className="nav-links">
          <li onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</li>
          <li onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>Team</li>
          <li onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Sign in</li>
        </ul>
      </nav>

      <div className="hero-content">
        <div style={{ position: 'relative', height: 'min(30svh, 300px)' }}>
          <TextPressure
            text="Play2Learn"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={36}
          />
        </div>
        <p className="hero-subtitle">Play2Learn is a gamified learning platform that transforms education into an interactive journey.
        Instead of traditional study methods, users progress through levels like a game, unlocking knowledge step by step. With a dopamine-driven design, 2D characters, and subject-based challenges, Play2Learn makes learning fun, addictive, and rewarding</p>
        <div className="buttons reveal">
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started →</button>
          <button
            className="btn-secondary"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it works →
          </button>
        </div>
      </div>

      <div style={{ height: 'min(60svh, 520px)', width: '100%', position: 'relative', margin: 0, marginTop: '8px', overflow: 'hidden' }}>
        <CircularGallery 
          bend={3} 
          textColor="#ffffff" 
          borderRadius={0.05} 
          scrollEase={0.02}
          items={[
            { image: '/Images/Aptitude.png', text: 'Aptitude' },
            { image: '/Images/coding.png', text: 'Coding' },
            { image: '/Images/Maths.png', text: 'Mathematics' },
            { image: '/Images/Science.png', text: 'Science' },
            { image: '/Images/History.png', text: 'History' },
          ]}
        />
      </div>
    </div>

    <section id="how-it-works" className="section" style={{ fontFamily: '\"Instrument Sans\", system-ui, Arial, sans-serif' }}>
      <div className="container">
        {/* Main Content - Two Column Layout */}
        <div className="two-col-grid reveal">
          {/* Left Side - Video */}
          <div className="mascot-panel reveal" style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%',
            minHeight: 'min(60svh, 420px)',
            display: 'flex',
            alignItems: 'stretch'
          }}>
            <video
              src="/Videos/mascotv.mp4"
              poster="/Images/Maskot.png"
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Removed play overlay per request */}
          </div>

          {/* Right Side - How it Works */}
          <div className="reveal">
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 3rem 0',
              lineHeight: '1.2'
            }}>
              How it Works
            </h2>

            {/* Steps List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {/* Step 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px'
              }}>
                <div style={{
                  minWidth: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🎯
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 12px 0'
                  }}>
                    Choose Your Learning Path
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#cfcfd6',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    Select from various subjects like Coding, Mathematics, Science, and more. Each path is tailored to your current skill level and learning goals.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px'
              }}>
                <div style={{
                  minWidth: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🎮
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 12px 0'
                  }}>
                    Engage with Interactive Lessons
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#cfcfd6',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    Dive into gamified learning experiences with interactive challenges, quizzes, and hands-on projects that make complex concepts easy to understand.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px'
              }}>
                <div style={{
                  minWidth: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🏆
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 12px 0'
                  }}>
                    Track Your Progress
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#cfcfd6',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    Monitor your learning journey with detailed analytics, achievement badges, and progress tracking to stay motivated and celebrate your victories.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px'
              }}>
                <div style={{
                  minWidth: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 10px 30px rgba(67, 233, 123, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🤝
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 12px 0'
                  }}>
                    Join the Community
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#cfcfd6',
                    lineHeight: '1.6',
                    margin: '0'
                  }}>
                    Connect with fellow learners, share knowledge, participate in group challenges, and get support from our vibrant learning community.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div >
        </div>
        </div>
        </div>
      </div>
    </section>
    {/* Team Section */}
    <section id="team" className="section team-section">
      <div className="container">
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.2'
        }}>Meet our Team</h2>
        <p style={{ color: '#cfcfd6', margin: '0 0 32px 0' }}>Hey there! I'm Noodle, the Play2Learn mascot, and I'm thrilled to introduce our fantastic four-member team who make all this learning magic happen!</p>

        {/* Two-column layout sized like How it Works */}
        <div className="two-col-grid reveal">
          {/* Left: names list */}
          <div className="team-list">
            {[ 
              { name: 'Priyanka P', title: 'Product Designer', desc: 'Leads product experience and visual design with a focus on clarity and delight.' },
              { name: 'Raghunandan H', title: 'Frontend Engineer', desc: 'Owns UI engineering, performance, and accessibility across the app.' },
              { name: 'Shreemanth K', title: 'Software Engineer', desc: 'Builds core features and architecture with a passion for clean code.' },
              { name: 'Tejashwini G', title: 'Backend Engineer', desc: 'Designs APIs, data models, and resilient services that scale.' },
            ].map((m, i) => (
              <div key={i} className="team-item reveal">
                <div className="team-name">{m.name}</div>
                <div className="team-title">{m.title}</div>
                <div className="team-desc">{m.desc}</div>
              </div>
            ))}
          </div>
          {/* Right: mascot */}
          <div className="mascot-panel reveal" style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%',
            minHeight: 'min(70svh, 560px)',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center'
          }}>
            <video
              src="/Videos/TeamS.mp4"
              poster="/Images/maskot2.png"
              autoPlay
              muted
              loop
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
    {/* Footer */}
    <footer className="reveal" style={{ background: '#0b0c10', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="footer-inner">
        <div style={{ color: '#cfcfd6' }}>
          <strong style={{ color: '#fff' }}>Play2Learn</strong> · Learn by playing
        </div>
        <div style={{ display: 'flex', gap: '16px', color: '#cfcfd6' }}>
          <a href="#" style={{ color: '#cfcfd6', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: '#cfcfd6', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: '#cfcfd6', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#7a7a85', fontSize: '12px', paddingBottom: '24px' }}>
        © {new Date().getFullYear()} Play2Learn. All rights reserved.
      </div>
    </footer>
    </>
  );
}

export default App;
