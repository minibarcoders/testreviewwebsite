import { Users, Star, Shield, Cpu } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Community Driven",
    description: "Our reviews are shaped by real user experiences and community feedback."
  },
  {
    icon: Star,
    title: "Unbiased Reviews",
    description: "We purchase all products independently and never accept sponsored reviews."
  },
  {
    icon: Shield,
    title: "Expert Analysis",
    description: "Our team combines decades of tech experience with modern expertise."
  },
  {
    icon: Cpu,
    title: "Performance Focus",
    description: "Detailed benchmarks and real-world performance testing for every review."
  }
];

const team = [
  {
    name: "Alex Chen",
    role: "Lead Reviewer",
    bio: "20+ years experience in tech journalism and hardware testing."
  },
  {
    name: "Sarah Johnson",
    role: "Technical Editor",
    bio: "Former hardware engineer turned tech writer."
  },
  {
    name: "Mike Rodriguez",
    role: "Community Manager",
    bio: "Passionate about building bridges between users and technology."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Fixed or Custom</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about bridging the gap between modern technology and timeless quality.
            Our mission is to help you make informed decisions about tech purchases.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg">
                <div className="inline-block p-3 bg-indigo-50 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl max-w-2xl mx-auto">
            To provide honest, thorough, and accessible tech reviews that help you make 
            informed decisions about your technology investments.
          </p>
        </div>
      </div>
    </div>
  );
}
