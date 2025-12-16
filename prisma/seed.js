const { PrismaClient } = require("./generated/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("Cleaning existing data...");
  await prisma.comment.deleteMany();
  await prisma.blogView.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Data cleaned");

  // Create users
  console.log("Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      password: hashedPassword,
      verified: true,
      emailVerified: new Date(),
      credits: 100,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: hashedPassword,
      verified: true,
      emailVerified: new Date(),
      credits: 50,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Johnson",
      password: hashedPassword,
      verified: true,
      emailVerified: new Date(),
      credits: 200,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  });

  console.log(`✓ Created ${3} users`);

  // Create blog posts
  console.log("Creating blog posts...");

  const techPost1 = await prisma.blogPost.create({
    data: {
      title: "Getting Started with Next.js 15",
      content:
        "<h2>Introduction to Next.js 15</h2><p>Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced server components.</p><h3>Key Features</h3><ul><li>Turbopack for faster builds</li><li>Enhanced server actions</li><li>Improved caching strategies</li></ul><p>In this comprehensive guide, we'll explore all the new features and how to leverage them in your projects.</p>",
      excerpt:
        "Explore the exciting new features in Next.js 15 including Turbopack, enhanced server actions, and improved performance.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      topic: "TECHNOLOGY",
      published: true,
      type: "FREE",
      authorId: user1.id,
      viewCount: 150,
    },
  });

  const techPost2 = await prisma.blogPost.create({
    data: {
      title: "Building Scalable APIs with Node.js",
      content:
        "<h2>Designing Scalable APIs</h2><p>Learn how to build production-ready APIs that can handle millions of requests.</p><h3>Best Practices</h3><ul><li>Use proper error handling</li><li>Implement rate limiting</li><li>Design RESTful endpoints</li><li>Add authentication and authorization</li></ul><p>We'll cover everything from basic setup to advanced optimization techniques.</p>",
      excerpt:
        "Master the art of building scalable and maintainable APIs using Node.js and modern best practices.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      topic: "TECHNOLOGY",
      published: true,
      type: "PAID",
      authorId: user2.id,
      viewCount: 89,
    },
  });

  const healthPost1 = await prisma.blogPost.create({
    data: {
      title: "10 Daily Habits for Better Mental Health",
      content:
        "<h2>Improving Your Mental Wellness</h2><p>Mental health is just as important as physical health. Here are 10 daily habits that can transform your mental wellbeing.</p><h3>The Habits</h3><ol><li>Morning meditation (10 minutes)</li><li>Regular exercise</li><li>Healthy sleep schedule</li><li>Social connections</li><li>Journaling</li></ol><p>Implementing these habits consistently can lead to significant improvements in your overall mental health.</p>",
      excerpt:
        "Discover 10 simple daily habits that can significantly improve your mental health and overall wellbeing.",
      coverImage:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      topic: "HEALTH",
      published: true,
      type: "FREE",
      authorId: user3.id,
      viewCount: 234,
    },
  });

  const lifestylePost1 = await prisma.blogPost.create({
    data: {
      title: "Minimalist Living: A Complete Guide",
      content:
        "<h2>Embrace Minimalism</h2><p>Minimalist living is about finding freedom through having less. It's not about deprivation, but about making room for what truly matters.</p><h3>Getting Started</h3><ul><li>Declutter your space</li><li>Focus on quality over quantity</li><li>Practice mindful consumption</li><li>Create systems that work</li></ul><p>Learn how to simplify your life and focus on what truly brings you joy.</p>",
      excerpt:
        "Learn how to embrace minimalist living and find freedom through simplicity.",
      coverImage:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
      topic: "LIFESTYLE",
      published: true,
      type: "FREE",
      authorId: user1.id,
      viewCount: 178,
    },
  });

  const educationPost1 = await prisma.blogPost.create({
    data: {
      title: "Effective Learning Techniques for 2025",
      content:
        "<h2>Modern Learning Strategies</h2><p>The way we learn is evolving. Discover the most effective learning techniques backed by cognitive science.</p><h3>Proven Techniques</h3><ul><li>Spaced repetition</li><li>Active recall</li><li>Interleaving practice</li><li>The Feynman Technique</li></ul><p>These evidence-based methods can help you learn faster and retain information longer.</p>",
      excerpt:
        "Master modern learning techniques backed by cognitive science to learn faster and retain more.",
      coverImage:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      topic: "EDUCATION",
      published: true,
      type: "PAID",
      authorId: user2.id,
      viewCount: 112,
    },
  });

  const entertainmentPost1 = await prisma.blogPost.create({
    data: {
      title: "Top 10 Movies to Watch This Season",
      content:
        "<h2>Must-Watch Movies</h2><p>Our curated list of the best movies to watch this season across all genres.</p><h3>The List</h3><ol><li>Epic Sci-Fi Adventure</li><li>Heartwarming Drama</li><li>Thrilling Mystery</li><li>Laugh-Out-Loud Comedy</li><li>Inspiring Biography</li></ol><p>From blockbusters to indie gems, we've got something for everyone.</p>",
      excerpt:
        "Check out our carefully curated list of must-watch movies for this season.",
      coverImage:
        "https://images.unsplash.com/photo-1574267432644-f0b82e13eaeb?w=800",
      topic: "ENTERTAINMENT",
      published: true,
      type: "FREE",
      authorId: user3.id,
      viewCount: 201,
    },
  });

  // Create draft posts
  const draftPost = await prisma.blogPost.create({
    data: {
      title: "Understanding TypeScript Generics",
      content:
        "<h2>Work in Progress</h2><p>This post is still being written...</p>",
      excerpt:
        "Deep dive into TypeScript generics and how to use them effectively.",
      topic: "TECHNOLOGY",
      published: false,
      type: "FREE",
      authorId: user1.id,
    },
  });

  console.log(`✓ Created ${7} blog posts`);

  // Create comments
  console.log("Creating comments...");

  await prisma.comment.createMany({
    data: [
      {
        content: "Great article! Very helpful for beginners.",
        postId: techPost1.id,
        authorId: user2.id,
      },
      {
        content:
          "Thanks for sharing these insights. Looking forward to trying Next.js 15!",
        postId: techPost1.id,
        authorId: user3.id,
      },
      {
        content:
          "This is exactly what I needed. The API design patterns are spot on.",
        postId: techPost2.id,
        authorId: user1.id,
      },
      {
        content:
          "I've been implementing these habits for a month now and I already feel better!",
        postId: healthPost1.id,
        authorId: user2.id,
      },
      {
        content:
          "Minimalism changed my life. Great guide for anyone starting out.",
        postId: lifestylePost1.id,
        authorId: user3.id,
      },
      {
        content:
          "The spaced repetition technique really works. Highly recommend!",
        postId: educationPost1.id,
        authorId: user1.id,
      },
    ],
  });

  console.log(`✓ Created comments`);

  // Create blog views
  console.log("Creating blog views...");

  await prisma.blogView.createMany({
    data: [
      { postId: techPost1.id, userId: user2.id },
      { postId: techPost1.id, userId: user3.id },
      { postId: techPost2.id, userId: user1.id },
      { postId: healthPost1.id, userId: user1.id },
      { postId: healthPost1.id, userId: user2.id },
      { postId: lifestylePost1.id, userId: user2.id },
      { postId: educationPost1.id, userId: user3.id },
      { postId: entertainmentPost1.id, userId: user1.id },
    ],
  });

  console.log(`✓ Created blog views`);

  // Create subscriptions
  console.log("Creating subscriptions...");

  await prisma.subscription.create({
    data: {
      userId: user2.id,
      status: "ACTIVE",
      amount: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      razorpayOrderId: "order_test_123",
      razorpayPaymentId: "pay_test_123",
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user3.id,
      status: "ACTIVE",
      amount: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      razorpayOrderId: "order_test_456",
      razorpayPaymentId: "pay_test_456",
    },
  });

  console.log(`✓ Created subscriptions`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Users: ${3}`);
  console.log(`   Blog Posts: ${7} (${6} published, ${1} draft)`);
  console.log(`   Comments: ${6}`);
  console.log(`   Blog Views: ${8}`);
  console.log(`   Active Subscriptions: ${2}`);
  console.log("\n📧 Test User Credentials:");
  console.log("   Email: john@example.com | Password: password123");
  console.log("   Email: jane@example.com | Password: password123");
  console.log("   Email: alice@example.com | Password: password123");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
