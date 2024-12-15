'use client';

import Image from 'next/image';
import { Suspense } from 'react';

function AboutPageContent() {
  const teamMembers = [
    {
      name: 'Sander',
      role: 'Founder & Lead Reviewer',
      bio: 'Tech enthusiast with over a decade of experience in consumer electronics and software development.',
      image: '/images/team/sander.jpg'
    }
  ];

  const values = [
    {
      title: 'Unbiased Reviews',
      description: 'We never accept payment for reviews and always purchase our review units to ensure complete independence.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'In-Depth Analysis',
      description: 'Every review includes extensive testing and real-world usage to provide comprehensive insights.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'User-Focused',
      description: 'Our recommendations are based on real user needs and practical applications.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Transparency',
      description: "We're always clear about our testing methods and any potential limitations in our reviews.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About Fixed or Custom</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We're passionate about helping you make informed decisions about technology. 
            Through in-depth reviews and analysis, we bridge the gap between complex tech and practical user needs.
          </p>
        </div>

        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Process */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Review Process</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <span className="text-xl font-semibold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Research & Purchase</h3>
                <p className="text-slate-600">
                  We research market trends and purchase products with our own funds to maintain independence.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <span className="text-xl font-semibold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Testing & Analysis</h3>
                <p className="text-slate-600">
                  Extensive real-world testing and benchmarking to evaluate every aspect.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <span className="text-xl font-semibold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Review & Follow-up</h3>
                <p className="text-slate-600">
                  Comprehensive review publication followed by long-term usage updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 text-sm mb-3">{member.role}</p>
                  <p className="text-slate-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-slate-600 mb-8">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                     hover:bg-indigo-500 transition-colors duration-300"
          >
            Contact Us
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </section>
      </div>
    </main>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPageContent />
    </Suspense>
  );
} 