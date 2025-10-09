import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import TextPressure from './TextPressure';
import CircularGallery from './CircularGallery';
import FlowingMenu from './FlowingMenu';

function App() {
  const navigate = useNavigate();

  return (
    <>
    <div className="hero">
      <nav className="navbar">
        <h2 className="logo">Play2Learn</h2>
        <ul className="nav-links">
          <li>How it works</li>
          <li>Team</li>
          <li onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Sign in</li>
        </ul>
      </nav>

      <div className="hero-content">
        <div style={{position: 'relative', height: '300px'}}>
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
        <div className="buttons">
          <button className="btn-primary">Get Started →</button>
          <button className="btn-secondary">How it works →</button>
        </div>
      </div>

      <div style={{ height: '70vh', width: '100vw', position: 'relative', margin: '0 -40px', marginTop: '-20px' }}>
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
            { image: '/Images/Literature.png', text: 'Literature' }
          ]}
        />
      </div>
    </div>

    <section style={{
      background: '#0b0c10',
      padding: '200px 0 120px 0',
      fontFamily: '"Instrument Sans", system-ui, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px'
      }}>
        {/* Main Content - Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'stretch',
          minHeight: '70vh'
        }}>
          {/* Left Side - Video */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%',
            display: 'flex',
            alignItems: 'stretch'
          }}>
            <img
              src="/Images/Maskot.png"
              alt="Play2Learn Mascot"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                objectFit: 'cover',
                borderRadius: '24px'
              }}
            />
            {/* Removed play overlay per request */}
          </div>

          {/* Right Side - How it Works */}
          <div>
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
    <section style={{ padding: '120px 0', background: '#0b0c10' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 2rem 0',
          lineHeight: '1.2'
        }}>Meet our Team</h2>
        <p style={{ color: '#cfcfd6', margin: '0 0 24px 0' }}>Hey there! I'm Noodle, the Play2Learn mascot, and I'm thrilled to introduce our fantastic four-member team who make all this learning magic happen!</p>
        <div style={{
          height: '800px',
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)'
        }}>
          <FlowingMenu items={[
            { link: '#', text: 'Priyanka P', image: '/Images/1.jpg' },
            { link: '#', text: 'Raghunandan H', image: '/Images/2.jpg' },
            { link: '#', text: 'Shreemanth K', image: '/Images/3.jpg' },
            { link: '#', text: 'Tejashwini G', image: '/Images/4.jpg' }
          ]} />
      </div>
    </div>
    </section>
    </>
  );
}

export default App;
