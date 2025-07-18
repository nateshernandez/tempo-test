// Client Service - handles all client-related API operations
export interface Client {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateClientRequest {
  name: string
  email: string
  company: string
  phone?: string
}

// Mock data - replace with actual API calls later
const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp Solutions",
    phone: "+1 (555) 123-4567",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    company: "Innovate Digital",
    phone: "+1 (555) 987-6543",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@startupx.com",
    company: "StartupX",
    phone: "+1 (555) 456-7890",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

export const clientService = {
  // Fetch all clients
  async getClients(): Promise<Client[]> {
    return [...mockClients]
  },

  // Create new client
  async createClient(clientData: CreateClientRequest): Promise<Client> {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockClients.push(newClient)
    return newClient
  },
}
