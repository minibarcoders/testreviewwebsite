export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
  readingTime?: string;
}

export const blogPosts: { [key: string]: BlogPost } = {
  "future-of-ai-in-consumer-tech": {
    id: 1,
    slug: "future-of-ai-in-consumer-tech",
    title: "The Future of AI in Consumer Tech",
    excerpt: "How artificial intelligence is reshaping our daily interactions with technology...",
    author: "Sander",
    date: "March 15, 2024",
    category: "Technology Trends",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    readingTime: "6 min read",
    tags: ["AI", "Technology", "Future Tech", "Consumer Electronics"],
    content: `
      <div class="prose lg:prose-lg mx-auto">
        <p class="lead">Artificial Intelligence is rapidly transforming the consumer technology landscape, bringing unprecedented changes to how we interact with our devices and digital services.</p>

        <h2>The Current State of AI in Consumer Tech</h2>
        <p>From smartphones to smart home devices, AI is already deeply integrated into our daily lives. Here's how:</p>
        <ul>
          <li>Voice assistants have become more contextually aware</li>
          <li>Cameras use AI for improved photo processing</li>
          <li>Smart home devices learn from user behavior</li>
          <li>Personalized recommendations are more accurate than ever</li>
        </ul>

        <h2>Emerging Trends</h2>
        <p>Several key trends are shaping the future of AI in consumer technology:</p>
        <h3>1. On-Device AI</h3>
        <p>More AI processing is happening directly on devices, improving privacy and reducing latency.</p>
        
        <h3>2. Multimodal AI</h3>
        <p>AI systems are getting better at understanding and processing multiple types of input - text, voice, images, and gestures.</p>
        
        <h3>3. Adaptive AI</h3>
        <p>Systems that learn and adapt to individual users' preferences and behaviors in real-time.</p>

        <h2>Looking Ahead</h2>
        <p>The next few years will likely bring even more dramatic changes:</p>
        <ul>
          <li>More natural and contextual interactions with devices</li>
          <li>Predictive assistance that anticipates user needs</li>
          <li>Enhanced personalization across all devices and services</li>
          <li>Improved accessibility through AI-powered interfaces</li>
        </ul>

        <h2>Conclusion</h2>
        <p>As AI continues to evolve, we can expect our relationship with technology to become more intuitive and personalized. The key will be balancing these advances with privacy concerns and ethical considerations.</p>
      </div>
    `
  },
  "sustainable-tech-revolution": {
    id: 2,
    slug: "sustainable-tech-revolution",
    title: "Sustainable Tech: A Green Revolution",
    excerpt: "Exploring eco-friendly innovations in consumer electronics and their impact...",
    author: "Sander",
    date: "March 12, 2024",
    category: "Sustainability",
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop",
    readingTime: "5 min read",
    tags: ["Sustainability", "Green Tech", "Environment", "Innovation"],
    content: `
      <div class="prose lg:prose-lg mx-auto">
        <p class="lead">The tech industry is undergoing a green revolution, with companies increasingly focusing on sustainable practices and eco-friendly innovations.</p>

        <h2>Sustainable Manufacturing</h2>
        <p>Companies are adopting new manufacturing processes that prioritize sustainability:</p>
        <ul>
          <li>Recycled materials in product construction</li>
          <li>Renewable energy in manufacturing facilities</li>
          <li>Reduced packaging waste</li>
          <li>Circular economy initiatives</li>
        </ul>

        <h2>Energy Efficiency</h2>
        <p>Modern devices are being designed with energy efficiency in mind:</p>
        <ul>
          <li>More efficient processors and components</li>
          <li>Improved power management systems</li>
          <li>Energy-saving modes and features</li>
        </ul>

        <h2>Recycling Programs</h2>
        <p>Major tech companies are implementing comprehensive recycling programs:</p>
        <ul>
          <li>Trade-in and buyback programs</li>
          <li>E-waste recycling initiatives</li>
          <li>Component reuse programs</li>
        </ul>

        <h2>The Road Ahead</h2>
        <p>The future of sustainable tech looks promising, but there's still work to be done. Companies and consumers must continue to prioritize environmental responsibility in their tech choices.</p>
      </div>
    `
  }
}; 