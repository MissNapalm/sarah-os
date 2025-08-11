import React from "react";


export const AboutMeContent = () => (
  <div style={{
    padding: '30px',
    color: '#ffffff',
    maxWidth: '900px',
    margin: '0 auto',
    background: '#1e1e1e',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    lineHeight: '1.5',
    minHeight: '100%',
  }}>
    <div style={{
      display: 'flex',
      gap: '25px',
      marginBottom: '25px',
      alignItems: 'center',
    }}>
      <div style={{
        fontSize: '48px',
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2d2d30 0%, #252526 100%)',
        borderRadius: '12px',
        border: '1px solid #3e3e42',
        boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.1)',
      }}>
        👩‍💻
      </div>
      
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '6px',
          color: '#ffffff',
          letterSpacing: '-0.3px',
        }}>
          Sarah Clark
        </h1>
        <h2 style={{
          fontSize: '14px',
          color: '#cccccc',
          marginBottom: '12px',
          fontWeight: '400',
        }}>
          Full Stack Web Developer & Offensive Security Researcher
        </h2>
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          {['Full Stack Development', 'Offensive Security', 'React.js', 'Penetration Testing'].map(tag => (
            <span key={tag} style={{
              padding: '3px 8px',
              borderRadius: '3px',
              background: '#0e639c',
              fontSize: '11px',
              color: '#ffffff',
              border: '1px solid #1177bb',
              fontWeight: '400',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '4px',
      marginBottom: '16px',
      border: '1px solid #3e3e42',
    }}>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        marginBottom: '12px', 
        color: '#ffffff',
        borderBottom: '1px solid #3e3e42',
        paddingBottom: '6px'
      }}>
        Professional Summary
      </h3>
      <p style={{ marginBottom: '10px', color: '#cccccc', fontSize: '13px' }}>
        Security professional and web developer with 8 years of combined experience in security consulting, 
        penetration testing, and modern web development. I specialize in building fast, beautiful, and secure 
        web applications using React, Next.js, TypeScript, and Tailwind CSS.
      </p>
      <p style={{ color: '#cccccc', fontSize: '13px' }}>
        I bring a unique perspective to web development shaped by years of hands-on offensive security research, 
        including real-world threat analysis, red team simulations, and forensic investigations. My background 
        in ethical hacking allows me to design and build applications with security baked in from the start.
      </p>
    </div>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '4px',
      marginBottom: '16px',
      border: '1px solid #3e3e42',
    }}>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        marginBottom: '12px', 
        color: '#ffffff',
        borderBottom: '1px solid #3e3e42',
        paddingBottom: '6px'
      }}>
        Professional Experience
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', margin: '0' }}>
            Freelance Application Developer
          </h4>
          <span style={{ fontSize: '11px', color: '#0e639c', fontWeight: '500' }}>2023 - Present</span>
        </div>
        <p style={{ fontSize: '12px', color: '#cccccc', margin: '0 0 8px 0', fontStyle: 'italic' }}>
          Self-Employed • San Antonio, TX
        </p>
        <ul style={{ fontSize: '12px', color: '#cccccc', marginLeft: '16px', lineHeight: '1.4' }}>
          <li>Built functional, production-quality full-stack web applications designed for performance, security, and responsive user experience</li>
          <li>Developed apps using a modern tech stack including Python, Flask, Node.js, React, TypeScript, and Next.js</li>
          <li>Engineered predictive algorithms with machine learning techniques to deliver highly accurate data analysis and pattern detection</li>
          <li>Implemented robust application security layers including bcrypt password hashing, CORS control headers, and CSRF protection measures</li>
        </ul>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', margin: '0' }}>
            Independent Security Researcher
          </h4>
          <span style={{ fontSize: '11px', color: '#0e639c', fontWeight: '500' }}>2019 - Present</span>
        </div>
        <p style={{ fontSize: '12px', color: '#cccccc', margin: '0 0 8px 0', fontStyle: 'italic' }}>
          Self-Employed • San Antonio, TX
        </p>
        <ul style={{ fontSize: '12px', color: '#cccccc', marginLeft: '16px', lineHeight: '1.4' }}>
          <li>Conducted extensive ethical hacking and penetration testing projects across Windows, Linux, and Android systems</li>
          <li>Gained root or SYSTEM-level access on dozens of hardened devices using privilege escalation, custom malware, and AV/EDR evasion techniques</li>
          <li>Regularly analyzed and bypassed security mechanisms including Windows Defender, firewalls, and app hardening</li>
          <li>Applied ethical guidelines to all research and responsibly disclosed personal findings within self-contained systems</li>
        </ul>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <h4 style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', margin: '0' }}>
            IT Support Specialist & Security Consultant
          </h4>
          <span style={{ fontSize: '11px', color: '#0e639c', fontWeight: '500' }}>2014 - 2016</span>
        </div>
        <p style={{ fontSize: '12px', color: '#cccccc', margin: '0 0 8px 0', fontStyle: 'italic' }}>
          On-site Consulting • San Antonio, TX
        </p>
        <ul style={{ fontSize: '12px', color: '#cccccc', marginLeft: '16px', lineHeight: '1.4' }}>
          <li>Provided comprehensive on-site tech support and security consulting services for small to medium businesses</li>
          <li>Managed hardware and software installations, ensuring secure configurations and optimal performance</li>
          <li>Executed server upgrades and UPS installations to improve system reliability and disaster preparedness</li>
          <li>Implemented RSYNC backup solutions for automated data protection and recovery strategies</li>
        </ul>
      </div>
    </div>
  </div>
);

export const SkillsContent = () => {
  const SkillBubble = ({ skill }) => (
    <div
      style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #0e639c 0%, #0e639cdd 100%)',
        color: '#ffffff',
        padding: '8px 16px',
        borderRadius: '20px',
        margin: '4px',
        fontSize: '12px',
        fontWeight: '600',
        border: '1px solid #0e639c',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px) scale(1.05)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      }}
    >
      {skill}
    </div>
  );

  return (
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
        fontSize: '24px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '600',
        borderBottom: '2px solid #0e639c',
        paddingBottom: '12px',
      }}>💻 Software Expertise</h1>

      {/* Full-Stack Development */}
      <div style={{
        background: '#252526',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #3e3e42',
        marginBottom: '25px',
      }}>
        <h2 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: '#ffffff',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🌐 Full-Stack Development
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cccccc',
          lineHeight: '1.6',
          marginBottom: '15px',
        }}>
          Comprehensive full-stack development expertise spanning modern frontend frameworks, robust backend systems, 
          and scalable database architectures. Proficient in building responsive web applications with React.js and Next.js, 
          implementing secure RESTful APIs with Node.js and Python, and designing efficient database schemas with PostgreSQL. 
          Experience includes cloud deployment on AWS, containerization with Docker, and implementing CI/CD pipelines for 
          automated testing and deployment workflows.
        </p>
        <div style={{ textAlign: 'center' }}>
          {['React.js', 'Node.js', 'JavaScript', 'Python', 'Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Flask', 'C#'].map(skill => 
            <SkillBubble key={skill} skill={skill} />
          )}
        </div>
      </div>

      {/* Security */}
      <div style={{
        background: '#252526',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #3e3e42',
        marginBottom: '25px',
      }}>
        <h2 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: '#ffffff',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🛡️ Security
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cccccc',
          lineHeight: '1.6',
          marginBottom: '15px',
        }}>
          Specialized expertise in both offensive and defensive cybersecurity practices. Extensive experience in penetration 
          testing, vulnerability assessment, and ethical hacking methodologies. Skilled in digital forensics investigation, 
          incident response procedures, and malware analysis. Proficient in network security implementation and system hardening 
          protocols. All activities conducted within authorized environments following industry best practices and responsible 
          disclosure protocols.
        </p>
        <div style={{ textAlign: 'center' }}>
          {['Penetration Testing', 'Digital Forensics', 'Network Security', 'Linux Admin', 'Malware Analysis', 'Security Hardening', 'Incident Response'].map(skill => 
            <SkillBubble key={skill} skill={skill} />
          )}
        </div>
      </div>

      {/* DevOps & Infrastructure */}
      <div style={{
        background: '#252526',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #3e3e42',
        marginBottom: '25px',
      }}>
        <h2 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: '#ffffff',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🚀 DevOps & Infrastructure Management
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cccccc',
          lineHeight: '1.6',
          marginBottom: '15px',
        }}>
          Strong foundation in DevOps practices and infrastructure management. Experience with continuous integration and 
          deployment pipelines, containerization technologies, and cloud platform administration. Skilled in Linux system 
          administration, network configuration, and automation scripting. Proficient in monitoring, logging, and maintaining 
          high-availability systems while ensuring security compliance and optimal performance across development and 
          production environments.
        </p>
        <div style={{ textAlign: 'center' }}>
          {['CI/CD', 'AWS', 'Docker', 'Linux Admin', 'Network Security'].map(skill => 
            <SkillBubble key={skill} skill={skill} />
          )}
        </div>
      </div>

      {/* Game Development */}
      <div style={{
        background: '#252526',
        padding: '25px',
        borderRadius: '8px',
        border: '1px solid #3e3e42',
      }}>
        <h2 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: '#ffffff',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🎮 Game Development & Interactive Media
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cccccc',
          lineHeight: '1.6',
          marginBottom: '15px',
        }}>
          Creative application of programming skills in game development using Python and Pygame framework. Experience 
          in developing interactive applications with real-time physics simulation, collision detection algorithms, 
          and dynamic AI systems. Skilled in creating engaging user interfaces, implementing game mechanics, and 
          optimizing performance for smooth gameplay. Projects include physics-based simulations and action games 
          with progressive difficulty systems and interactive visual elements.
        </p>
        <div style={{ textAlign: 'center' }}>
          {['Pygame', 'Python', 'Game AI', 'Physics Simulation'].map(skill => 
            <SkillBubble key={skill} skill={skill} />
          )}
        </div>
      </div>
    </div>
  );
};

export const EthicalHacksContent = () => (
  <>
    <h2 style={{
      fontSize: '18px',
      marginBottom: '16px',
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      WebkitFontSmoothing: "subpixel-antialiased",
      MozOsxFontSmoothing: "auto",
      textRendering: "optimizeLegibility"
    }}>Web Development</h2>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
    }}>
      {/* 1. Self-Driving Car Dashboard */}
      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/aupticon.png"
          alt="Self-Driving Car Dashboard"
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Self-Driving Car Dashboard
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Interactive dashboard simulation for autonomous vehicles with real-time data visualization, 
          sensor monitoring, and route planning capabilities.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          React • Chart.js • WebSocket • Real-time Data
        </div>
      </div>

      {/* 2. New Italian Restaurant Project */}
      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/spaghetti.png"
          alt="Trattoria Bellissimo"
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Trattoria Bellissimo
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Web application for a local Italian restaurant, featuring a dynamic menu, online ordering, and a custom admin dashboard for managing orders and inventory.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          React • Node.js • Express • MongoDB • Stripe API
        </div>
      </div>
    </div>

    <h2 style={{
      fontSize: '18px',
      marginBottom: '16px',
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      WebkitFontSmoothing: "subpixel-antialiased",
      MozOsxFontSmoothing: "auto",
      textRendering: "optimizeLegibility"
    }}>Artificial Intelligence</h2>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
    }}>
      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/aria.png"
          alt="ARIA ElevenLabs Digital Assistant"
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          ARIA ElevenLabs Digital Assistant
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Advanced AI-powered voice assistant using ElevenLabs API for natural speech synthesis. 
          Features contextual conversations and task automation capabilities.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Python • ElevenLabs API • Speech Recognition • NLP
        </div>
      </div>

      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/helios.png"
          alt="HELIOS Local Ollama LLM"
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          HELIOS Local Ollama LLM
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Local large language model implementation using Ollama for privacy-focused AI assistance. 
          Optimized for offline operation and customizable responses.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Python • Ollama • Local LLM • Privacy-First AI
        </div>
      </div>
    </div>

    <h2 style={{
      fontSize: '18px',
      marginBottom: '16px',
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      WebkitFontSmoothing: "subpixel-antialiased",
      MozOsxFontSmoothing: "grayscale"
    }}>Game Development (Pygame)</h2>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
    }}>
      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/fluid.png"
          alt="Fluid Dynamics Physics Playground"
          style={{
            width: '100%',
            height: '130px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Fluid Dynamics Physics Playground
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Interactive physics simulation demonstrating fluid dynamics principles with real-time particle systems 
          and customizable environmental parameters.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Python • Pygame • Physics Simulation • Particle Systems
        </div>
      </div>

      <div style={{
        background: '#252526',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #3e3e42',
      }}>
        <img 
          src="/antibody.png"
          alt="Antibody"
          style={{
            width: '100%',
            height: '100px',
            borderRadius: '4px',
            objectFit: 'cover',
            marginBottom: '12px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h3 style={{ 
          fontSize: '14px', 
          color: '#ffffff', 
          fontWeight: '500', 
          marginBottom: '8px',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.3px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Antibody
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#e0e0e0', 
          marginBottom: '8px', 
          fontWeight: '400',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.1px",
          lineHeight: "1.5",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Action-packed Python game where players control white blood cells to clear infections. 
          Features dynamic enemy AI, power-ups, and progressive difficulty levels.
        </p>
        <div style={{ 
          fontSize: '10px', 
          color: '#4fc3f7', 
          fontWeight: '500',
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          letterSpacing: "0.2px",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}>
          Python • Pygame • Game AI • Collision Detection
        </div>
      </div>
    </div>

    <div style={{ 
      fontSize: '12px', 
      color: '#cccccc', 
      textAlign: 'center', 
      fontStyle: 'italic', 
      fontWeight: '300',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      All projects developed with best practices in mind and following industry standards.
    </div>
  </>
);

export const NonprofitContent = () => (
  <div style={{
    padding: '30px',
    color: '#ffffff',
    background: '#1e1e1e',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    lineHeight: '1.6',
    maxHeight: '400px',
    overflowY: 'auto',
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '25px'
    }}>
      <h1 style={{
        fontSize: '24px',
        marginBottom: '8px',
        color: '#fff',
        fontWeight: '600',
      }}>Cybersecurity Expertise</h1>
      <p style={{
        fontSize: '14px',
        color: '#cccccc',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        Comprehensive security research, red team operations, and defensive strategies
      </p>
    </div>

    <div style={{
      display: 'grid',
      gap: '20px',
      marginBottom: '25px'
    }}>
      {[
        {
          title: 'Penetration Testing & Red Team Operations',
          details: 'Advanced exploitation techniques including bypassing fully patched Windows 11 systems with Defender and Firewall enabled. Expertise in privilege escalation, lateral movement, and persistence mechanisms.',
          skills: ['Network Exploitation', 'Windows Evasion', 'Privilege Escalation', 'Persistence Techniques']
        },
        {
          title: 'Custom Malware Research & Development',
          details: 'Developed "GhostKey" - a sophisticated Remote Access Trojan using screenshot exfiltration to avoid VNC detection. Features include C-transpiled Python implants for maximum AV evasion. In 2025, also completed a lab intercepting and decrypting HTTPS traffic for advanced analysis.',
          skills: ['Python → C Transpilation', 'AV Evasion', 'C2 Infrastructure', 'Custom RAT Development']
        },
        {
          title: 'Mobile & Network Security',
          details: 'Mobile penetration testing on Android 14 devices, HTTPS traffic interception using mitmproxy, DNS interception, deauth attacks, and comprehensive network analysis.',
          skills: ['Android Exploitation', 'HTTPS Interception', 'DNS Manipulation', 'WiFi Security']
        },
        {
          title: 'Digital Forensics & Blue Team',
          details: 'Network traffic analysis, malware reverse engineering, incident response, and defensive security strategies. Experienced with industry tools and custom forensic solutions.',
          skills: ['Traffic Analysis', 'Malware Analysis', 'Incident Response', 'DFIR']
        }
      ].map((area, index) => (
        <div key={index} style={{
          background: '#252526',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #3e3e42',
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            marginBottom: '10px',
            color: '#0e639c',
            fontWeight: '600'
          }}>
            {area.title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#cccccc',
            marginBottom: '12px',
            lineHeight: '1.5'
          }}>
            {area.details}
          </p>
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap'
          }}>
            {area.skills.map(skill => (
              <span key={skill} style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: '#0e639c',
                fontSize: '11px',
                color: '#ffffff',
                border: '1px solid #1177bb',
                fontWeight: '400',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #3e3e42',
      marginBottom: '20px'
    }}>
      <h3 style={{ 
        fontSize: '16px', 
        marginBottom: '10px',
        color: '#0e639c',
        fontWeight: '600'
      }}>
        Security Tools & Technologies
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '8px',
        marginBottom: '15px'
      }}>
        {['OWASP ZAP', 'SQLMap', 'Burp Suite', 'Metasploit', 'mitmproxy', 'Wireshark', 'Nmap', 'Hashcat'].map(tool => (
          <span key={tool} style={{
            padding: '6px 10px',
            borderRadius: '4px',
            background: '#1e1e1e',
            fontSize: '12px',
            color: '#cccccc',
            border: '1px solid #3e3e42',
            textAlign: 'center',
            fontWeight: '400',
          }}>
            {tool}
          </span>
        ))}
      </div>
      <p style={{
        fontSize: '13px',
        color: '#cccccc',
        lineHeight: '1.5'
      }}>
        Extensive experience with industry-standard security tools for vulnerability assessment, 
        network analysis, and penetration testing across multiple platforms and environments.
      </p>
    </div>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #3e3e42',
    }}>
      <h3 style={{ 
        fontSize: '16px', 
        marginBottom: '10px',
        color: '#0e639c',
        fontWeight: '600'
      }}>
        Security Philosophy
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#cccccc',
        lineHeight: '1.6',
        fontStyle: 'italic'
      }}>
        "Security isn't just about protecting systems—it's about protecting people. Having witnessed 
        firsthand how easily privacy can evaporate in our digital age, I believe vigilance and 
        proactive security measures are essential to preserving human dignity and freedom in cyberspace."
      </p>
    </div>
  </div>
);

export const SettingsContent = () => (
  <div style={{
    padding: '40px',
    color: 'rgba(255, 255, 255, 0.9)',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%)'
  }}>
    <h1 style={{
      fontSize: '21px',
      marginBottom: '30px',
      textAlign: 'center',
      color: '#fff'
    }}>Settings</h1>

    <div style={{
      display: 'grid',
      gap: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {['Dark Mode', 'Startup Sound', 'Notifications'].map((setting, index) => (
        <div key={index} style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span>{setting}</span>
          <div style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              transition: 'transform 0.2s'
            }}/>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CybersecurityContent = () => (
  <div style={{
    padding: '30px',
    color: '#ffffff',
    background: '#1e1e1e',
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    minHeight: '100%',
  }}>
    <h1 style={{
      fontSize: '24px',
      marginBottom: '20px',
      color: '#ffffff',
      fontWeight: '600',
      textAlign: 'center',
      borderBottom: '2px solid #dc3545',
      paddingBottom: '12px',
    }}>🛡️ Cybersecurity Projects</h1>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #3e3e42',
      marginBottom: '20px',
    }}>
      <h2 style={{
        fontSize: '18px',
        color: '#dc3545',
        marginBottom: '15px',
        fontWeight: '600',
      }}>Information Security Research</h2>
      
      <p style={{
        fontSize: '14px',
        color: '#cccccc',
        lineHeight: '1.6',
        marginBottom: '15px',
      }}>
        Comprehensive cybersecurity research and ethical hacking initiatives conducted in secure, 
        controlled environments. All penetration testing and vulnerability assessments performed 
        with explicit authorization and documented methodologies following industry best practices.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px',
        marginTop: '20px',
      }}>
        <div style={{
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #dc3545',
        }}>
          <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }}>
            🔍 Penetration Testing Suite
          </h3>
          <p style={{ fontSize: '13px', color: '#cccccc', marginBottom: '8px' }}>
            Custom automated penetration testing framework for web applications and network infrastructure.
          </p>
          <div style={{ fontSize: '11px', color: '#dc3545', fontWeight: '500' }}>
            Python • Nmap • Metasploit • OWASP
          </div>
        </div>

        <div style={{
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #dc3545',
        }}>
          <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }}>
            🔒 Vulnerability Assessment Tools
          </h3>
          <p style={{ fontSize: '13px', color: '#cccccc', marginBottom: '8px' }}>
            Advanced vulnerability scanning and assessment toolkit for enterprise security audits.
          </p>
          <div style={{ fontSize: '11px', color: '#dc3545', fontWeight: '500' }}>
            Nessus • OpenVAS • Burp Suite • Custom Scripts
          </div>
        </div>

        <div style={{
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #dc3545',
        }}>
          <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }}>
            🔐 Digital Forensics Platform
          </h3>
          <p style={{ fontSize: '13px', color: '#cccccc', marginBottom: '8px' }}>
            Comprehensive digital forensics investigation platform for incident response and evidence analysis.
          </p>
          <div style={{ fontSize: '11px', color: '#dc3545', fontWeight: '500' }}>
            Volatility • Sleuth Kit • Autopsy • Custom Tools
          </div>
        </div>

        <div style={{
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '6px',
          border: '1px solid #dc3545',
        }}>
          <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }}>
            🛡️ Security Hardening Scripts
          </h3>
          <p style={{ fontSize: '13px', color: '#cccccc', marginBottom: '8px' }}>
            Automated security hardening and compliance scripts for Linux and Windows environments.
          </p>
          <div style={{ fontSize: '11px', color: '#dc3545', fontWeight: '500' }}>
            Bash • PowerShell • Ansible • CIS Benchmarks
          </div>
        </div>
      </div>
    </div>

    <div style={{
      background: '#252526',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #3e3e42',
      textAlign: 'center',
    }}>
      <div style={{
        background: '#dc3545',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '20px',
        display: 'inline-block',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '10px',
      }}>
        ⚠️ ETHICAL DISCLOSURE
      </div>
      <p style={{
        fontSize: '12px',
        color: '#cccccc',
        fontStyle: 'italic',
        lineHeight: '1.5',
      }}>
        All security research conducted under proper authorization with responsible disclosure protocols. 
        Projects focus on defensive security improvements and vulnerability remediation.
      </p>
    </div>
  </div>
);

export const ProjectsContent = () => (
  <div className="projects-content">
    {/* Spaghetti Project Entry (replaces Mangione's Kitchen) */}
    <div className="project-entry bg-[#252526] p-5 rounded-lg border border-[#3e3e42] mb-6 flex flex-col md:flex-row items-center">
      <img
        src="/spaghetti.png"
        alt="Spaghetti"
        className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border border-[#444]"
        style={{ flexShrink: 0 }}
      />
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Spaghetti</h2>
        <p className="text-sm text-gray-300 mb-2">
          Web application for a local Italian restaurant, featuring a dynamic menu, online ordering, and a custom admin dashboard for managing orders and inventory.
        </p>
        <div className="text-xs text-[#dc3545] font-semibold">
          React • Node.js • Express • MongoDB • Stripe API
        </div>
      </div>
    </div>
  </div>
);
