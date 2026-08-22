export const company = {
  name: "Royal Consultancy Services",
  shortName: "RCS",
  description:
    "RCS combines strategy, design, technology, and marketing to help businesses build, launch, and scale.",
  email: "royalconsultancyservices24@gmail.com",
  phone: "+977 9741812381",
  phoneHref: "tel:+9779741812381",
  address: "Narephat-32, Kathmandu, Nepal",
  siteUrl: "https://rcs.com.np",
  social: {
    facebook: "https://www.facebook.com/share/1DwAMCHRMC/",
    instagram: "https://www.instagram.com/royal_consultancy_.services?igsh=azRwaHBsOG9yNzQ3",
    linkedin: "https://www.linkedin.com/company/royalconsultancyservices/",
  },
};

export const services = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Performance-focused campaigns, content, paid media, and analytics built around meaningful growth.",
    icon: "ChartNoAxesCombined",
  },
  {
    id: "marketing-strategy",
    title: "Marketing Strategy",
    description: "Positioning, campaign planning, market insight, and practical acquisition strategy for clearer decisions.",
    icon: "Compass",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Corporate websites, portals, e-commerce, and custom web applications designed for real business needs.",
    icon: "Code2",
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Modern mobile and business applications with focused user experiences and dependable foundations.",
    icon: "Smartphone",
  },
  {
    id: "saas-development",
    title: "SaaS Development",
    description: "Cloud software, dashboards, subscription platforms, and business tools designed to grow with users.",
    icon: "Blocks",
  },
  {
    id: "ai-solutions",
    title: "AI Solutions",
    description: "AI-assisted workflows, intelligent assistants, integrations, and automation shaped around useful outcomes.",
    icon: "Sparkles",
  },
  {
    id: "branding-creative",
    title: "Branding & Creative",
    description: "Brand identity, visual systems, social creative, and digital experiences that make a business recognizable.",
    icon: "Palette",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    description: "Systems that reduce repetitive work, connect operations, and give teams more room to move forward.",
    icon: "Workflow",
  },
];

export const projectFilters = ["All", "Web", "App", "SaaS", "AI", "Marketing", "Branding", "Automation"];

// Keep project facts here rather than distributing them throughout components.
// Add a new project by completing this model and its verified metadata/assets.
export const projects = [
  {
    id: "business-sarthi",
    slug: "business-sarthi",
    title: "Business Sarthi",
    tagline: "Business management platform",
    shortDescription:
      "A centralized business management platform for operations, staff, and day-to-day business activity.",
    fullDescription:
      "Business Sarthi is an RCS business management platform designed to bring employee, attendance, sales, inventory, distributor, vendor, and business activity management into one place.",
    categories: ["SaaS", "Automation"],
    status: "in-progress",
    statusLabel: "In development",
    statusNote: "Product details will be expanded as they are confirmed for publication.",
    kind: "product",
    featured: true,
    client: "RCS product",
    industry: "Business technology",
    technologies: [],
    services: [],
    features: [],
    objectives: [
      "Create a centralized platform for core business-management activity.",
      "Give growing teams a more connected view of operations.",
    ],
    solution:
      "A product-focused platform concept shaped around practical business operations, with detailed feature and technology information to be published only after verification.",
    results: [],
    gallery: [],
    liveUrl: "",
    githubUrl: "",
    seo: {
      title: "Business Sarthi — Business Management Platform | RCS",
      description:
        "Business Sarthi is an RCS business management platform designed to centralize core business operations.",
    },
  },
];

export const insightCategories = ["Technology", "Business", "Marketing", "AI", "SaaS", "Digital Growth", "Case Studies"];

export const process = [
  ["01", "Discover", "Understand the business, users, market, and objectives before deciding what to build."],
  ["02", "Strategize", "Shape the solution, scope, priorities, and growth direction around the real problem."],
  ["03", "Design", "Create clear user experiences and a visual system that makes the product easier to use."],
  ["04", "Build", "Develop, integrate, test, and refine the solution with care for quality and scale."],
  ["05", "Launch", "Prepare the work for real users, measurement, feedback, and a confident release."],
  ["06", "Grow", "Improve, automate, and evolve the system as the business and its needs change."],
];
