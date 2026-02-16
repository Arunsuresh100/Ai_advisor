
import React from 'react';
import { Link } from 'react-router-dom';

const NeuralSphere = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    const particleCount = 150;
    const mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }
      draw() {
        ctx.fillStyle = 'rgba(203, 163, 92, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.strokeStyle = `rgba(203, 163, 92, ${1 - distance / 50})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[100vh] flex items-center justify-center pt-48 pb-32 px-6 bg-surface-background overflow-hidden text-center">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[500px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center gap-8">
        
        {/* Platform Features Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-border/50 border border-white/5 text-primary-500 text-[10px] font-bold uppercase tracking-[0.15em] animate-fade-in shadow-xl">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Platform Features
        </div>

        {/* Heading Section */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white animate-slide-up text-center">
            <span className="md:whitespace-nowrap">Your Complete <span className="text-primary-500">Legal Research</span></span> <br className="hidden md:block" />
            Toolkit
          </h1>

          <div className="space-y-5 max-w-3xl mx-auto">
            <p className="text-gray-400 text-lg md:text-[19px] leading-relaxed font-medium animate-slide-up animate-delay-200">
              AI-powered chat, document analysis, voice input, and multi-language support. <br className="hidden md:block" /> Every you need to navigate Indian law with confidence.
            </p>
            <p className="text-gray-500 text-[13px] font-medium animate-slide-up animate-delay-300">
              Built for Indian litigants, lawyers, law students, and legal researchers.
            </p>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up animate-delay-400">
          <Link to="/ai-advisor" className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-primary-600/20 flex items-center gap-2.5 text-sm">
            Ask Your First Legal Question Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
          
          <a href="#details" className="px-8 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 text-white font-bold rounded-lg transition-all duration-300 text-sm">
            Explore All Features
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;
