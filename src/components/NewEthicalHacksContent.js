export const EthicalHacksContent = () => (
    <div style={{
      padding: '30px',
      color: '#ffffff',
      background: '#1e1e1e',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      minHeight: '100%',
    }}>
      <h1 style={{
        fontSize: '20px',
        marginBottom: '20px',
        textAlign: 'left',
        color: '#ffffff',
        fontWeight: '600',
        borderBottom: '1px solid #3e3e42',
        paddingBottom: '8px',
      }}>Featured Projects</h1>

      {/* Web Development Section */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{
          fontSize: '16px',
          marginBottom: '16px',
          color: '#ffffff',
          fontWeight: '600',
          borderBottom: '1px solid #3e3e42',
          paddingBottom: '6px'
        }}>Web Development</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              Mangione's Italian Kitchen
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Full-stack restaurant website featuring online ordering, menu management, and customer portal. 
              Built with React frontend and Node.js backend with PostgreSQL database.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              React • Node.js • PostgreSQL • Stripe Integration
            </div>
          </div>

          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              Self-Driving Car Dashboard
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Interactive dashboard simulation for autonomous vehicles with real-time data visualization, 
              sensor monitoring, and route planning capabilities.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              React • Chart.js • WebSocket • Real-time Data
            </div>
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{
          fontSize: '16px',
          marginBottom: '16px',
          color: '#ffffff',
          fontWeight: '600',
          borderBottom: '1px solid #3e3e42',
          paddingBottom: '6px'
        }}>Artificial Intelligence</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              ARIA ElevenLabs Digital Assistant
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Advanced AI-powered voice assistant using ElevenLabs API for natural speech synthesis. 
              Features contextual conversations and task automation capabilities.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              Python • ElevenLabs API • Speech Recognition • NLP
            </div>
          </div>

          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              HELIOS Local Ollama LLM
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Local large language model implementation using Ollama for privacy-focused AI assistance. 
              Optimized for offline operation and customizable responses.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              Python • Ollama • Local LLM • Privacy-First AI
            </div>
          </div>
        </div>
      </div>

      {/* Pygame Section */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{
          fontSize: '16px',
          marginBottom: '16px',
          color: '#ffffff',
          fontWeight: '600',
          borderBottom: '1px solid #3e3e42',
          paddingBottom: '6px'
        }}>Game Development (Pygame)</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              Antibody
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Action-packed Python game where players control white blood cells to clear infections. 
              Features dynamic enemy AI, power-ups, and progressive difficulty levels.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              Python • Pygame • Game AI • Collision Detection
            </div>
          </div>

          <div style={{
            background: '#1e1e1e',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #3e3e42',
          }}>
            <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '8px' }}>
              Fluid Dynamics Physics Playground
            </h3>
            <p style={{ fontSize: '12px', color: '#cccccc', marginBottom: '8px' }}>
              Interactive physics simulation demonstrating fluid dynamics principles with real-time particle systems 
              and customizable environmental parameters.
            </p>
            <div style={{ fontSize: '10px', color: '#0e639c', fontWeight: '500' }}>
              Python • Pygame • Physics Simulation • Particle Systems
            </div>
          </div>
        </div>
      </div>

      {/* Cybersecurity Section with InfoSec Button */}
      <div style={{
        background: '#252526',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{
          fontSize: '16px',
          marginBottom: '16px',
          color: '#ffffff',
          fontWeight: '600',
          borderBottom: '1px solid #3e3e42',
          paddingBottom: '6px'
        }}>Cybersecurity Research</h2>
        
        <p style={{ fontSize: '13px', color: '#cccccc', marginBottom: '16px', lineHeight: '1.5' }}>
          Comprehensive security research and ethical hacking projects conducted in controlled environments. 
          All activities performed with proper authorization and documented methodologies.
        </p>
        
        <div style={{ textAlign: 'center' }}>
          <button style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
          }}
          onClick={() => {
            console.log("Navigate to InfoSec section");
          }}
          >
            🛡️ View Information Security Projects
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#cccccc', textAlign: 'center', marginTop: '30px', fontStyle: 'italic' }}>
        All projects developed with best practices in mind and following industry standards.
      </div>
    </div>
  );
