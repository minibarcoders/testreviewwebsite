export interface Review {
  id: number;
  slug: string;
  title: string;
  snippet: string;
  content: string;
  rating: number;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  pros: string[];
  cons: string[];
  specifications?: {
    [key: string]: string | number;
  };
  verdict: string;
}

export const reviews: { [key: string]: Review } = {
  "macbook-pro-m3": {
    id: 1,
    slug: "macbook-pro-m3",
    title: "MacBook Pro M3 Review",
    snippet: "The latest MacBook Pro with M3 chip sets new standards for laptop performance...",
    rating: 4.8,
    category: "Laptops",
    author: "Sander",
    date: "March 15, 2024",
    imageUrl: "/images/reviews/macbook-pro-m3.jpg",
    pros: [
      "Exceptional performance",
      "Outstanding battery life",
      "Beautiful display",
      "Excellent build quality"
    ],
    cons: [
      "Premium price point",
      "Limited port selection",
      "No Face ID"
    ],
    specifications: {
      "Processor": "Apple M3 Pro/Max",
      "RAM": "Up to 128GB unified memory",
      "Storage": "Up to 8TB SSD",
      "Display": "14.2-inch or 16.2-inch Liquid Retina XDR",
      "Battery": "Up to 22 hours"
    },
    verdict: "The MacBook Pro M3 sets new standards for professional laptops, offering unmatched performance and efficiency.",
    content: `
      <div class="prose lg:prose-lg mx-auto">
        <p class="lead">Apple's latest MacBook Pro with the M3 chip represents a significant leap forward in laptop performance and capabilities.</p>

        <h2>Performance</h2>
        <p>The M3 chip delivers exceptional performance across both single-core and multi-core tasks. In our testing, we saw:</p>
        <ul>
          <li>40% faster rendering times compared to M2</li>
          <li>Improved machine learning capabilities</li>
          <li>Better power efficiency</li>
        </ul>

        <h2>Display & Design</h2>
        <p>The Liquid Retina XDR display continues to impress with its:</p>
        <ul>
          <li>1600 nits peak brightness</li>
          <li>Excellent color accuracy</li>
          <li>ProMotion technology</li>
        </ul>

        <h2>Battery Life</h2>
        <p>Battery life remains a strong point, with up to 22 hours of video playback and 15 hours of web browsing.</p>

        <h2>Verdict</h2>
        <p>The MacBook Pro M3 sets new standards for professional laptops, offering unmatched performance and efficiency in a familiar but refined package.</p>
      </div>
    `
  },
  "sony-wh1000xm5": {
    id: 2,
    slug: "sony-wh1000xm5",
    title: "Sony WH-1000XM5 Headphones",
    snippet: "Industry-leading noise cancellation meets premium audio quality...",
    rating: 4.9,
    category: "Audio",
    author: "Sander",
    date: "March 12, 2024",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    pros: [
      "Best-in-class noise cancellation",
      "Excellent sound quality",
      "Comfortable for long sessions",
      "Strong battery life"
    ],
    cons: [
      "Premium price",
      "No water resistance",
      "Non-foldable design"
    ],
    specifications: {
      "Driver": "30mm",
      "Battery Life": "30 hours (NC on)",
      "Charging": "USB-C",
      "Weight": "250g",
      "Bluetooth": "5.2"
    },
    verdict: "The Sony WH-1000XM5 represents the pinnacle of wireless headphone technology.",
    content: `
      <div class="prose lg:prose-lg mx-auto">
        <p class="lead">Sony's flagship noise-cancelling headphones continue to set the standard for premium audio experiences.</p>

        <h2>Noise Cancellation</h2>
        <p>The WH-1000XM5 features Sony's most advanced noise cancellation yet:</p>
        <ul>
          <li>Eight microphones for precise noise detection</li>
          <li>Improved algorithm for better ambient noise reduction</li>
          <li>Adaptive Sound Control that learns from your behavior</li>
        </ul>

        <h2>Audio Quality</h2>
        <p>Sound quality is exceptional with:</p>
        <ul>
          <li>30mm drivers with premium coating</li>
          <li>LDAC codec support for high-resolution audio</li>
          <li>DSEE Extreme upscaling for compressed audio</li>
        </ul>

        <h2>Battery Life</h2>
        <p>The headphones offer up to 30 hours of playback with noise cancellation enabled.</p>

        <h2>Verdict</h2>
        <p>The Sony WH-1000XM5 represents the pinnacle of wireless headphone technology, offering unmatched noise cancellation and exceptional sound quality.</p>
      </div>
    `
  }
}; 