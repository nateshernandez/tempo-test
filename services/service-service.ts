// Service/Product Service - handles all service-related API operations
export interface Service {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Mock data - replace with actual API calls later
const mockServices: Service[] = [
  {
    id: "1",
    name: "Brand Strategy Consultation",
    description: "Comprehensive brand positioning and strategy development",
    basePrice: 5000,
    category: "Strategy",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    name: "Logo Design Package",
    description: "Complete logo design with 3 concepts and unlimited revisions",
    basePrice: 2500,
    category: "Design",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Website Development",
    description: "Custom responsive website with CMS integration",
    basePrice: 8000,
    category: "Development",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "3-month SEO campaign with keyword research and optimization",
    basePrice: 3000,
    category: "Marketing",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    name: "Social Media Management",
    description: "Monthly social media content creation and management",
    basePrice: 1500,
    category: "Marketing",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "6",
    name: "Content Writing",
    description: "Professional copywriting for web and marketing materials",
    basePrice: 1200,
    category: "Content",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export const serviceService = {
  // Fetch all services
  async getServices(): Promise<Service[]> {
    return mockServices.filter((service) => service.isActive)
  },
}
