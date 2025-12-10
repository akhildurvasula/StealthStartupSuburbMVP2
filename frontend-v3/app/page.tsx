'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [suburb, setSuburb] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Porchlight</h1>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn quiet suburbs into living communities.
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Porchlight helps neighbors host micro-events, meet nearby people, and build real culture in car-dependent suburbs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={scrollToWaitlist}
                className="px-8 py-4 bg-amber-500 text-white text-lg font-semibold rounded-full hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Get early access
              </button>
              <Link
                href="/app"
                className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-full hover:bg-gray-50 transition-colors border-2 border-gray-300"
              >
                Launch app
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              Starting with suburbs around Raleigh–Durham–Chapel Hill.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Modern suburbs are lonely by design.
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Car dependence and single-use zoning keep people isolated. You can live on a street for years without knowing your neighbors. Urban fixes like transit and walkability take decades—but loneliness is happening now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🚗</div>
              <h4 className="font-semibold text-gray-900 mb-2">Designed for cars, not people</h4>
              <p className="text-sm text-gray-600">Every trip requires driving</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🏠</div>
              <h4 className="font-semibold text-gray-900 mb-2">No shared spaces</h4>
              <p className="text-sm text-gray-600">Nowhere to casually meet</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">👻</div>
              <h4 className="font-semibold text-gray-900 mb-2">Invisible neighbors</h4>
              <p className="text-sm text-gray-600">Anonymous faces in driveways</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">⏰</div>
              <h4 className="font-semibold text-gray-900 mb-2">No time to organize</h4>
              <p className="text-sm text-gray-600">Planning events is hard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Porchlight turns your suburb into a culture engine.
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Host micro-events</h4>
              <p className="text-gray-600 leading-relaxed">
                Start small things like coffee in the cul-de-sac, dog walks, or porch music. Choose from simple templates and go live in one tap.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">See what's happening near you</h4>
              <p className="text-gray-600 leading-relaxed">
                Live neighborhood map shows nearby events and interest signals. Everything is walking or biking distance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Build real belonging</h4>
              <p className="text-gray-600 leading-relaxed">
                Repeated meetups turn neighbors into community. See the same faces, learn names, and feel like your suburb is alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            How it works
          </h3>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Open the map</h4>
                <p className="text-gray-600 leading-relaxed">
                  See micro-events and interest spots in your suburb. Everything is hyperlocal—within a few blocks.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Host or suggest an idea</h4>
                <p className="text-gray-600 leading-relaxed">
                  Choose from templates like coffee meetup, dog hour, evening walk. One tap and it's live on the map.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Neighbors join</h4>
                <p className="text-gray-600 leading-relaxed">
                  People nearby tap "Join" or "I'm interested." No complicated RSVPs or group chats.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Your suburb starts to feel alive</h4>
                <p className="text-gray-600 leading-relaxed">
                  Familiar faces, recurring meetups, and the sense that your neighborhood has culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Built for neighbors who care.
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">👋</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Residents</h4>
              <p className="text-gray-600 italic leading-relaxed">
                "I want to feel less alone and actually know the people around me."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">🌟</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Neighborhood organizers</h4>
              <p className="text-gray-600 italic leading-relaxed">
                "I'm the person who always hosts things and want better tools."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                Coming soon
              </div>
              <div className="text-3xl mb-4 opacity-60">🏘️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 opacity-60">Suburban leaders</h4>
              <p className="text-gray-600 italic leading-relaxed opacity-60">
                "HOAs and local groups who want more vibrant communities."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access / Email Capture */}
      <section id="waitlist" className="py-20 bg-gradient-to-b from-gray-50 to-amber-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Be one of the first to turn the lights on.
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're testing Porchlight with a small group of neighborhoods around Raleigh–Durham–Chapel Hill. Leave your email and suburb, and we'll reach out as we expand.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h4 className="text-2xl font-bold text-emerald-900 mb-2">You're on the list!</h4>
              <p className="text-emerald-700">We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="suburb" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your suburb or neighborhood
                  </label>
                  <input
                    id="suburb"
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="e.g., Cary, Morrisville, Chapel Hill"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-amber-500 text-white text-lg font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-md hover:shadow-lg"
                >
                  Join the waitlist
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Mission / Founder Blurb */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Why we're building Porchlight.
          </h3>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We believe suburbs can be more than traffic and driveways. With the right rituals and tools, they can become places where people belong and culture grows. Porchlight makes it effortless to turn lonely cul-de-sacs into neighborhoods that feel alive.
            </p>
            <p className="text-gray-600 font-medium">
              — Porchlight team
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <span className="text-white font-semibold">Porchlight</span>
            </div>
            
            <p className="text-sm">
              Built for suburbs everywhere, starting in North Carolina.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a href="mailto:hello@porchlight.community" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2025 Porchlight. Building community, one porch at a time.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

