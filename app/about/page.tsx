export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        <div className="prose lg:prose-lg">
          <p className="text-lg text-gray-600 mb-6">
            Welcome to TechReview, your trusted source for in-depth technology reviews and insights. 
            We're passionate about helping you make informed decisions about your tech purchases.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Our mission is to provide honest, unbiased, and thorough reviews of the latest technology 
            products. We believe in transparency and helping our readers make informed decisions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Honesty in every review</li>
            <li>Thorough testing and analysis</li>
            <li>User-focused recommendations</li>
            <li>Transparent review process</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 