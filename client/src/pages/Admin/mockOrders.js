export  const mockOrders = [
  {
    id: "ORD-2024-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    orderDate: "2024-01-15",
    status: "completed",
    total: 289.99,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 199.99 },
      { name: "Phone Case", quantity: 2, price: 45.00 }
    ],
    shippingAddress: {
      street: "123 Oak Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA"
    },
    billingAddress: {
      street: "123 Oak Street",
      city: "San Francisco", 
      state: "CA",
      zip: "94102",
      country: "USA"
    }
  },
  {
    id: "ORD-2024-002",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    phone: "+1 (555) 987-6543",
    orderDate: "2024-01-14",
    status: "processing",
    total: 149.50,
    items: [
      { name: "Bluetooth Speaker", quantity: 1, price: 149.50 }
    ],
    shippingAddress: {
      street: "456 Pine Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "USA"
    },
    billingAddress: {
      street: "456 Pine Avenue",
      city: "Los Angeles",
      state: "CA", 
      zip: "90210",
      country: "USA"
    }
  },
  {
    id: "ORD-2024-003",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@email.com",
    phone: "+1 (555) 456-7890",
    orderDate: "2024-01-13",
    status: "pending",
    total: 75.25,
    items: [
      { name: "Notebook Set", quantity: 3, price: 75.25 }
    ],
    shippingAddress: {
      street: "789 Maple Drive",
      city: "Austin",
      state: "TX",
      zip: "73301",
      country: "USA"
    },
    billingAddress: {
      street: "789 Maple Drive",
      city: "Austin",
      state: "TX",
      zip: "73301", 
      country: "USA"
    }
  },
  {
    id: "ORD-2024-004",
    customerName: "David Wilson",
    customerEmail: "david.wilson@email.com",
    phone: "+1 (555) 321-0987",
    orderDate: "2024-01-12",
    status: "cancelled",
    total: 399.99,
    items: [
      { name: "Laptop Stand", quantity: 1, price: 129.99 },
      { name: "Wireless Mouse", quantity: 1, price: 79.99 },
      { name: "Keyboard", quantity: 1, price: 190.01 }
    ],
    shippingAddress: {
      street: "321 Elm Street",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA"
    },
    billingAddress: {
      street: "321 Elm Street",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA"
    }
  },
  {
    id: "ORD-2024-005",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.anderson@email.com",
    phone: "+1 (555) 654-3210",
    orderDate: "2024-01-11",
    status: "processing",
    total: 199.99,
    items: [
      { name: "Smart Watch", quantity: 1, price: 199.99 }
    ],
    shippingAddress: {
      street: "654 Cedar Lane",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA"
    },
    billingAddress: {
      street: "654 Cedar Lane",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA"
    }
  },
  {
    id: "ORD-2024-006",
    customerName: "James Taylor",
    customerEmail: "j.taylor@email.com",
    phone: "+1 (555) 789-0123",
    orderDate: "2024-01-10",
    status: "completed",
    total: 89.99,
    items: [
      { name: "USB Cable", quantity: 5, price: 89.95 }
    ],
    shippingAddress: {
      street: "987 Birch Road",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA"
    },
    billingAddress: {
      street: "987 Birch Road",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA"
    }
  }
];