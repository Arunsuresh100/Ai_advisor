
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
        ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
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
            ctx.strokeStyle = `rgba(16, 185, 129, ${1 - distance / 50})`;
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
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 px-6 bg-slate-950 overflow-hidden">
      {/* Neural Background Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <NeuralSphere />
      </div>

      {/* Aurora Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 aurora-blur rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 aurora-blur rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Left Column: Strategic Content */}
          <div className="flex-1 text-left space-y-8">
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight leading-[1] animate-slide-up text-white">
              The Smarter Way <br />
              <span className="text-gradient-gold text-5xl md:text-7xl">to Research Indian Law</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-medium animate-slide-up animate-delay-200">
              Your complete legal research toolkit. NyayAI handles complex case research, document analysis, and instant legal queries—all grounded in Indian statutes and judgments.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-slide-up animate-delay-300">
              <Link to="/ai-advisor" className="group relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all duration-500 overflow-hidden shadow-2xl shadow-primary-600/30">
                <span className="relative z-10 flex items-center gap-3">
                  Ask Your First Question Free
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Component */}
          <div className="flex-1 relative lg:h-[600px] w-full flex items-center justify-center animate-fade-in animate-delay-500">
            <div className="relative">
               <img 
                 src="https://cdn.prod.website-files.com/612e545fdda38481883243da/6299076f64395866a2b70e35_Chat%20bot-pana.webp"
                 alt="Legal Assistant"
                 className="max-w-[280px] md:max-w-[400px] h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float"
               />
               {/* Subtle Backglow for the image */}
               <div className="absolute inset-0 bg-primary-600/10 blur-[100px] -z-10 rounded-full opacity-50 translate-y-10"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
