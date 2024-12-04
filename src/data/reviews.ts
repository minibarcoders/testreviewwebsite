import { ReviewArticle } from '@/services/articleService';

export const reviews: Record<string, ReviewArticle> = {
  "macbook-pro-m3-max": {
    id: "1",
    slug: "macbook-pro-m3-max",
    title: "MacBook Pro M3 Max Review",
    summary: "Apple's most powerful laptop yet - but is it worth the upgrade?",
    snippet: "Apple's most powerful laptop yet - but is it worth the upgrade?",
    imageUrl: "/images/macbook-pro-m3.jpg",
    author: {
      name: "Sander"
    },
    createdAt: "2024-03-15T00:00:00.000Z",
    category: "Review",
    rating: 9.2,
    pros: [
      "Incredible performance",
      "Excellent battery life",
      "Beautiful display",
      "Premium build quality"
    ],
    cons: [
      "High price tag",
      "Limited port selection",
      "No Face ID"
    ],
    content: `
      <div class="prose lg:prose-lg mx-auto">
        <p class="lead">The new MacBook Pro with M3 Max represents the pinnacle of Apple's laptop engineering, offering unprecedented performance in a familiar yet refined package.</p>

        <h2>Design and Build Quality</h2>
        <p>The MacBook Pro maintains Apple's premium design language with its all-aluminum chassis. While the design hasn't changed significantly from previous models, it remains one of the most well-built laptops on the market.</p>

        <h2>Performance</h2>
        <p>The M3 Max chip delivers exceptional performance across all use cases:</p>
        <ul>
          <li>40% faster than M2 Max in CPU tasks</li>
          <li>50% improvement in GPU performance</li>
          <li>Handles 4K and 8K video editing with ease</li>
          <li>Improved machine learning capabilities</li>
        </ul>

        <h2>Display</h2>
        <p>The Liquid Retina XDR display continues to impress with:</p>
        <ul>
          <li>1600 nits peak brightness</li>
          <li>P3 wide color gamut</li>
          <li>ProMotion 120Hz refresh rate</li>
          <li>Mini-LED backlighting</li>
        </ul>

        <h2>Battery Life</h2>
        <p>Despite the performance improvements, battery life remains excellent:</p>
        <ul>
          <li>Up to 22 hours of video playback</li>
          <li>12-14 hours of heavy development work</li>
          <li>Fast charging support</li>
        </ul>

        <h2>Verdict</h2>
        <p>The MacBook Pro M3 Max is the ultimate laptop for professionals who demand the absolute best performance. While the price tag is substantial, the combination of power, efficiency, and build quality makes it a worthwhile investment for the right user.</p>
      </div>
    `,
    verdict: "The MacBook Pro M3 Max sets a new standard for laptop performance, though its high price means it's best suited for professionals who can take advantage of its capabilities.",
    specifications: {
      "Processor": "M3 Max",
      "RAM": "Up to 128GB",
      "Storage": "Up to 8TB",
      "Display": "14.2-inch or 16.2-inch Liquid Retina XDR",
      "Battery": "Up to 22 hours"
    }
  }
}; 