'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [suburb, setSuburb] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waitlist signup:', { email, suburb });
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSuburb('');
      setSubmitted(false);
    }, 3000);
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#0D0D0F] overflow-hidden">
      {/* Hero Section - Full Screen with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Suburban neighborhood"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F]/70 via-[#0D0D0F]/50 to-[#0D0D0F]"></div>
        </div>

        {/* Floating Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F6C56A] to-[#E8A34A] rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-[#0D0D0F]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">Porchlight</span>
            </div>
            
            <Link
              href="/app"
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 hover:scale-105"
            >
              Launch app
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F6C56A]/20 backdrop-blur-md border border-[#F6C56A]/30 rounded-full mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-[#F6C56A] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#F6C56A]">Now live in RTP suburbs</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
            Turn quiet suburbs<br />
            <span className="bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] bg-clip-text text-transparent">
              into living communities
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Help neighbors host micro-events, meet nearby people, and build real culture in car-dependent suburbs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <button
              onClick={scrollToWaitlist}
              className="group px-8 py-4 bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] text-[#0D0D0F] text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#F6C56A]/50 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Get early access
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/20 hover:scale-105 active:scale-95"
            >
              Learn more
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Problem Section - Split with Image */}
      <section className="relative bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#F6C56A]/10 text-[#E8A34A] font-semibold rounded-full mb-6">
                The Problem
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1E] mb-8 leading-tight">
                Modern suburbs are lonely by design.
              </h2>
              <p className="text-xl text-[#3A3A3C] leading-relaxed mb-8">
                Car dependence and single-use zoning keep people isolated. You can live on a street for years without knowing your neighbors.
              </p>
              <p className="text-xl text-[#3A3A3C] leading-relaxed">
                Urban fixes like transit and walkability take decades—but <span className="text-[#E8A34A] font-semibold">loneliness is happening now.</span>
              </p>
            </div>

            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80"
                alt="Suburban street"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/30 to-transparent"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 mt-24">
            {[
              { emoji: '🚗', title: 'Designed for cars', subtitle: 'Not people' },
              { emoji: '🏠', title: 'No shared spaces', subtitle: 'Nowhere to meet' },
              { emoji: '👻', title: 'Invisible neighbors', subtitle: 'Anonymous faces' },
              { emoji: '⏰', title: 'No time', subtitle: 'Too hard to organize' },
            ].map((item, i) => (
              <div key={i} className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-[#F6C56A]/5 hover:to-[#E8A34A]/5 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</div>
                <h4 className="font-bold text-lg text-[#1C1C1E] mb-2">{item.title}</h4>
                <p className="text-sm text-[#3A3A3C]">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - Visual Showcase */}
      <section className="relative bg-gradient-to-b from-[#F5F5F7] to-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-[#8BA989]/10 text-[#8BA989] font-semibold rounded-full mb-6">
              The Solution
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1E] mb-6 leading-tight">
              Porchlight turns your suburb<br />
              <span className="bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] bg-clip-text text-transparent">
                into a culture engine.
              </span>
            </h2>
          </div>

          {/* Feature Cards with Images */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
                icon: '🎯',
                title: 'Host micro-events',
                description: 'Start small things like coffee in the cul-de-sac, dog walks, or porch music. Choose from simple templates and go live in one tap.',
                gradient: 'from-[#F6C56A]/20 to-[#E8A34A]/20'
              },
              {
                image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
                icon: '🗺️',
                title: 'See what\'s happening',
                description: 'Live neighborhood map shows nearby events and interest signals. Everything is walking or biking distance.',
                gradient: 'from-[#8BA989]/20 to-[#8BA989]/10'
              },
              {
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
                icon: '🤝',
                title: 'Build real belonging',
                description: 'Repeated meetups turn neighbors into community. See the same faces, learn names, and feel like your suburb is alive.',
                gradient: 'from-[#F6C56A]/20 to-[#F6C56A]/10'
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient}`}></div>
                  <div className="absolute top-6 left-6 text-5xl">{feature.icon}</div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1C1C1E] mb-4">{feature.title}</h3>
                  <p className="text-[#3A3A3C] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Timeline */}
      <section id="how-it-works" className="relative bg-white py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1E] mb-6">
              How it works
            </h2>
            <p className="text-xl text-[#3A3A3C]">Four simple steps to transform your suburb</p>
          </div>

          <div className="space-y-16">
            {[
              {
                num: '1',
                title: 'Open the map',
                description: 'See micro-events and interest spots in your suburb. Everything is hyperlocal—within a few blocks.',
                image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&q=80'
              },
              {
                num: '2',
                title: 'Host or suggest an idea',
                description: 'Choose from templates like coffee meetup, dog hour, evening walk. One tap and it\'s live on the map.',
                image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80'
              },
              {
                num: '3',
                title: 'Neighbors join',
                description: 'People nearby tap "Join" or "I\'m interested." No complicated RSVPs or group chats.',
                image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80'
              },
              {
                num: '4',
                title: 'Your suburb feels alive',
                description: 'Familiar faces, recurring meetups, and the sense that your neighborhood has culture.',
                image: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&q=80'
              },
            ].map((step, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F6C56A] to-[#E8A34A] text-[#0D0D0F] rounded-2xl font-bold text-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="text-3xl font-bold text-[#1C1C1E] mb-4">{step.title}</h3>
                  <p className="text-xl text-[#3A3A3C] leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-1 relative h-80 w-full rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F6C56A]/10 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Who It's For */}
      <section className="relative bg-gradient-to-b from-[#F5F5F7] to-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1E] mb-6">
              Built for neighbors who care.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                persona: 'Residents',
                quote: "I want to feel less alone and actually know the people around me.",
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
                badge: null
              },
              {
                persona: 'Neighborhood organizers',
                quote: "I\'m the person who always hosts things and want better tools.",
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                badge: null
              },
              {
                persona: 'Suburban leaders',
                quote: "HOAs and local groups who want more vibrant communities.",
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
                badge: 'Coming soon'
              },
            ].map((testimonial, i) => (
              <div key={i} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {testimonial.badge && (
                  <div className="absolute top-6 right-6 z-10 px-4 py-2 bg-[#F6C56A] text-[#0D0D0F] text-xs font-bold rounded-full shadow-lg">
                    {testimonial.badge}
                  </div>
                )}
                <div className="relative h-64">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.persona}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-700 ${testimonial.badge ? 'opacity-40' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-3xl">
                    {i === 0 ? '👋' : i === 1 ? '🌟' : '🏘️'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#1C1C1E] mb-4">{testimonial.persona}</h3>
                  <p className="text-[#3A3A3C] italic leading-relaxed">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access - Premium CTA */}
      <section id="waitlist" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1920&q=80"
            alt="Community gathering"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F]/90 to-[#1C1C1E]/95"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Be one of the first to<br />
              <span className="bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] bg-clip-text text-transparent">
                turn the lights on.
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              We&apos;re testing Porchlight with a small group of neighborhoods around Raleigh–Durham–Chapel Hill.
            </p>
          </div>

          {submitted ? (
            <div className="backdrop-blur-xl bg-white/10 border-2 border-[#8BA989] rounded-3xl p-12 text-center">
              <div className="text-6xl mb-6">✨</div>
              <h3 className="text-3xl font-bold text-white mb-3">You&apos;re on the list!</h3>
              <p className="text-xl text-gray-300">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#F6C56A] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="suburb" className="block text-sm font-bold text-white mb-3">
                    Your suburb or neighborhood
                  </label>
                  <input
                    id="suburb"
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="e.g., Cary, Morrisville, Chapel Hill"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#F6C56A] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-5 bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] text-[#0D0D0F] text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#F6C56A]/50 transition-all hover:scale-105 active:scale-95"
                >
                  Join the waitlist
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-8">
              Why we&apos;re building Porchlight.
            </h2>
          </div>
          
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-[#F6C56A]/5 to-[#E8A34A]/5 border-2 border-[#F6C56A]/20">
            <div className="absolute -top-6 left-12 w-12 h-12 bg-gradient-to-br from-[#F6C56A] to-[#E8A34A] rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-7 h-7 text-[#0D0D0F]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            
            <p className="text-2xl text-[#1C1C1E] leading-relaxed mb-8 font-light">
              We believe suburbs can be more than traffic and driveways. With the right rituals and tools, they can become places where people <span className="font-semibold bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] bg-clip-text text-transparent">belong</span> and culture <span className="font-semibold bg-gradient-to-r from-[#F6C56A] to-[#E8A34A] bg-clip-text text-transparent">grows</span>.
            </p>
            <p className="text-2xl text-[#1C1C1E] leading-relaxed mb-8 font-light">
              Porchlight makes it effortless to turn lonely cul-de-sacs into neighborhoods that feel alive.
            </p>
            
            <div className="flex items-center gap-4 pt-6 border-t border-[#F6C56A]/20">
              <div className="w-12 h-12 bg-[#1C1C1E] rounded-full"></div>
              <div>
                <p className="font-bold text-[#1C1C1E]">Porchlight team</p>
                <p className="text-sm text-[#3A3A3C]">Building community, one porch at a time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0F] text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F6C56A] to-[#E8A34A] rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-[#0D0D0F]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">Porchlight</span>
            </div>
            
            <p className="text-center">
              Built for suburbs everywhere, starting in North Carolina.
            </p>
            
            <div className="flex gap-6">
              <a href="mailto:hello@porchlight.community" className="hover:text-[#F6C56A] transition-colors font-medium">
                Contact
              </a>
              <a href="#" className="hover:text-[#F6C56A] transition-colors font-medium">
                Twitter
              </a>
              <a href="#" className="hover:text-[#F6C56A] transition-colors font-medium">
                Instagram
              </a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>© 2025 Porchlight. Building community, one porch at a time.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
      `}</style>
    </main>
  );
}
