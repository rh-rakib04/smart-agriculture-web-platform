/**
 * Mock Data for Smart Agriculture Platform
 * Contains dummy data for all dashboards and modules
 * This data is used for frontend demonstration only
 */

// ============ FARMER MOCK DATA ============
export const farmerMockData = {
  farmer: {
    id: 'FARMER001',
    name: 'Rajesh Kumar',
    email: 'rajesh@farm.com',
    phone: '+91-9876543210',
    location: 'Punjab',
    avatar: '👨‍🌾',
    totalFarmArea: 25, // hectares
    yearsOfExperience: 15,
  },

  crops: [
    {
      id: 'CROP001',
      name: 'Wheat',
      area: 10,
      plantedDate: '2025-11-15',
      expectedHarvestDate: '2026-04-15',
      status: 'Growing',
      Health: 87,
      stage: 'Heading',
      irrigation: 'Drip',
      lastChecked: '2026-02-15',
    },
    {
      id: 'CROP002',
      name: 'Rice',
      area: 8,
      plantedDate: '2025-06-20',
      expectedHarvestDate: '2025-11-20',
      status: 'Harvested',
      health: 95,
      stage: 'Mature',
      irrigation: 'Flood',
      lastChecked: '2025-11-20',
    },
    {
      id: 'CROP003',
      name: 'Mustard',
      area: 7,
      plantedDate: '2025-10-10',
      expectedHarvestDate: '2026-03-15',
      status: 'Growing',
      health: 82,
      stage: 'Growth',
      irrigation: 'Rain-fed',
      lastChecked: '2026-02-14',
    },
  ],

  expenses: [
    { id: 1, category: 'Seeds', amount: 15000, date: '2025-11-15', crop: 'Wheat' },
    { id: 2, category: 'Fertilizers', amount: 8000, date: '2025-12-01', crop: 'Wheat' },
    { id: 3, category: 'Pesticides', amount: 5000, date: '2025-12-10', crop: 'Wheat' },
    { id: 4, category: 'Labor', amount: 12000, date: '2025-12-15', crop: 'Rice' },
    { id: 5, category: 'Irrigation', amount: 4000, date: '2026-01-05', crop: 'Wheat' },
    { id: 6, category: 'Equipment Maintenance', amount: 3500, date: '2026-01-20', crop: 'Mustard' },
  ],

  weather: {
    current: {
      location: 'Punjab',
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      feelsLike: 20,
      uvIndex: 6,
    },
    forecast: [
      { day: 'Mon', high: 28, low: 15, condition: 'Sunny', precipitation: 0 },
      { day: 'Tue', high: 26, low: 14, condition: 'Cloudy', precipitation: 5 },
      { day: 'Wed', high: 24, low: 12, condition: 'Rainy', precipitation: 45 },
      { day: 'Thu', high: 25, low: 13, condition: 'Partly Cloudy', precipitation: 10 },
      { day: 'Fri', high: 27, low: 15, condition: 'Sunny', precipitation: 0 },
    ],
  },

  aiRecommendations: [
    {
      id: 1,
      crop: 'Wheat',
      recommendation: 'Apply nitrogen fertilizer immediately for optimal growth',
      priority: 'High',
      details: 'Nitrogen levels detected below optimal. Apply 50kg/hectare.',
      action: 'Schedule Fertilizer Application',
    },
    {
      id: 2,
      crop: 'Wheat',
      recommendation: 'Monitor for early leaf blight - detected in nearby fields',
      priority: 'Medium',
      details: 'Fungal disease risk high due to humidity. Consider preventive spray.',
      action: 'View Disease Details',
    },
    {
      id: 3,
      crop: 'Mustard',
      recommendation: 'Optimal irrigation window closes in 3 days',
      priority: 'Medium',
      details: 'Weather forecast shows rain incoming. Plan irrigation accordingly.',
      action: 'Check Weather',
    },
  ],

  calendarEvents: [
    { date: '2026-02-20', event: 'Wheat - First Irrigation', type: 'irrigation' },
    { date: '2026-02-28', event: 'Mustard - Pesticide Application', type: 'maintenance' },
    { date: '2026-03-15', event: 'Mustard - Harvest Due', type: 'harvest' },
    { date: '2026-04-15', event: 'Wheat - Harvest Due', type: 'harvest' },
  ],
};

// ============ BUYER MOCK DATA ============
export const buyerMockData = {
  buyer: {
    id: 'BUYER001',
    name: 'Arjun Patel',
    email: 'arjun@buyers.com',
    phone: '+91-8765432109',
    businessType: 'Agricultural Trader',
    avatar: '👨‍💼',
    registeredDate: '2024-06-15',
    totalPurchases: 45,
    rating: 4.8,
  },

  availableCrops: [
    {
      id: 'AVAIL001',
      cropName: 'Wheat',
      farmerId: 'FARMER001',
      farmerName: 'Rajesh Kumar',
      quantity: 100,
      unit: 'Quintals',
      pricePerUnit: 2500,
      totalPrice: 250000,
      quality: 'Premium',
      location: 'Punjab',
      harvestDate: '2026-04-15',
      description: 'High-quality wheat with excellent protein content',
      rating: 4.8,
      image: '🌾',
    },
    {
      id: 'AVAIL002',
      cropName: 'Rice',
      farmerId: 'FARMER002',
      farmerName: 'Priya Singh',
      quantity: 150,
      unit: 'Quintals',
      pricePerUnit: 3000,
      totalPrice: 450000,
      quality: 'Grade A',
      location: 'West Bengal',
      harvestDate: '2025-11-20',
      description: 'Pure basmati rice - ready for market',
      rating: 4.9,
      image: '🍚',
    },
    {
      id: 'AVAIL003',
      cropName: 'Mustard',
      farmerId: 'FARMER003',
      farmerName: 'Harjeet Singh',
      quantity: 80,
      unit: 'Quintals',
      pricePerUnit: 4500,
      totalPrice: 360000,
      quality: 'Premium',
      location: 'Haryana',
      harvestDate: '2026-03-15',
      description: 'Organic mustard seeds for oil extraction',
      rating: 4.7,
      image: '🌱',
    },
    {
      id: 'AVAIL004',
      cropName: 'Cotton',
      farmerId: 'FARMER004',
      farmerName: 'Ahmed Khan',
      quantity: 120,
      unit: 'Bales',
      pricePerUnit: 8000,
      totalPrice: 960000,
      quality: 'Premium',
      location: 'Maharashtra',
      harvestDate: '2025-12-20',
      description: 'High-staple cotton - excellent for spinning',
      rating: 4.6,
      image: '🧵',
    },
  ],

  harvestEstimates: [
    {
      cropName: 'Wheat',
      estimatedYield: 4.2,
      unit: 'Tons/Hectare',
      quality: 'Premium',
      readyDate: '2026-04-15',
      trend: 'up',
    },
    {
      cropName: 'Rice',
      estimatedYield: 5.8,
      unit: 'Tons/Hectare',
      quality: 'Grade A',
      readyDate: '2025-11-20',
      trend: 'stable',
    },
  ],

  purchaseRequests: [
    {
      id: 'REQ001',
      cropName: 'Wheat',
      quantity: 50,
      unit: 'Quintals',
      status: 'Pending Approval',
      farmerName: 'Rajesh Kumar',
      requestDate: '2026-02-15',
      desiredDeliveryDate: '2026-04-20',
      totalAmount: 125000,
      notes: 'Need delivery to Mumbai warehouse',
    },
    {
      id: 'REQ002',
      cropName: 'Rice',
      quantity: 100,
      unit: 'Quintals',
      status: 'Approved',
      farmerName: 'Priya Singh',
      requestDate: '2025-11-15',
      desiredDeliveryDate: '2025-11-25',
      totalAmount: 300000,
      notes: 'Expedited delivery required',
    },
  ],

  messages: [
    {
      id: 1,
      sender: 'Rajesh Kumar',
      senderType: 'farmer',
      timestamp: '2026-02-15 14:30',
      message: 'Wheat harvest ready by April 15. Quality is premium. Please confirm purchase interest.',
      read: true,
    },
    {
      id: 2,
      sender: 'Priya Singh',
      senderType: 'farmer',
      timestamp: '2026-02-14 10:15',
      message: 'Can you arrange pickup for rice? Available from Nov 25 onwards.',
      read: true,
    },
    {
      id: 3,
      sender: 'Ahmed Khan',
      senderType: 'farmer',
      timestamp: '2026-02-13 16:45',
      message: 'Cotton bales packed and ready. Competitive pricing available.',
      read: false,
    },
  ],
};

// ============ ADMIN MOCK DATA ============
export const adminMockData = {
  admin: {
    id: 'ADMIN001',
    name: 'Sharma Admin',
    email: 'admin@smartagri.com',
    role: 'Platform Administrator',
    avatar: '👨‍💻',
  },

  userStats: {
    totalFarmers: 1250,
    totalBuyers: 325,
    totalStudents: 450,
    activeUsers: 1845,
    newUsersThisMonth: 145,
  },

  users: [
    {
      id: 'USER001',
      name: 'Rajesh Kumar',
      type: 'Farmer',
      email: 'rajesh@farm.com',
      status: 'Active',
      joinDate: '2024-06-15',
      lastLogin: '2026-02-15',
      region: 'Punjab',
    },
    {
      id: 'USER002',
      name: 'Arjun Patel',
      type: 'Buyer',
      email: 'arjun@buyers.com',
      status: 'Active',
      joinDate: '2024-08-20',
      lastLogin: '2026-02-15',
      region: 'Gujarat',
    },
    {
      id: 'USER003',
      name: 'Priya Singh',
      type: 'Farmer',
      email: 'priya@farm.com',
      status: 'Active',
      joinDate: '2024-07-10',
      lastLogin: '2026-02-14',
      region: 'West Bengal',
    },
    {
      id: 'USER004',
      name: 'Harsh Verma',
      type: 'Student',
      email: 'harsh@student.edu',
      status: 'Inactive',
      joinDate: '2024-09-01',
      lastLogin: '2026-01-20',
      region: 'Delhi',
    },
  ],

  activities: [
    {
      id: 1,
      type: 'Listing Created',
      user: 'Rajesh Kumar',
      description: 'Created new wheat crop listing',
      timestamp: '2026-02-15 14:30',
      status: 'Success',
    },
    {
      id: 2,
      type: 'Purchase Request',
      user: 'Arjun Patel',
      description: 'Submitted purchase request for 50Q wheat',
      timestamp: '2026-02-15 13:45',
      status: 'Pending',
    },
    {
      id: 3,
      type: 'Payment Processed',
      user: 'Priya Singh',
      description: 'Received payment for rice crop',
      timestamp: '2026-02-15 12:20',
      status: 'Success',
    },
    {
      id: 4,
      type: 'Message Sent',
      user: 'Ahmed Khan',
      description: 'Sent message to Arjun Patel',
      timestamp: '2026-02-15 11:10',
      status: 'Success',
    },
  ],

  analyticsData: {
    monthlyTransactions: [
      { month: 'Jan', value: 45 },
      { month: 'Feb', value: 62 },
      { month: 'Mar', value: 58 },
      { month: 'Apr', value: 75 },
      { month: 'May', value: 88 },
    ],
    userGrowth: [
      { month: 'Jan', farmers: 800, buyers: 250, students: 300 },
      { month: 'Feb', farmers: 950, buyers: 290, students: 380 },
      { month: 'Mar', farmers: 1100, buyers: 310, students: 420 },
    ],
    topCrops: [
      { crop: 'Wheat', transactions: 245 },
      { crop: 'Rice', transactions: 198 },
      { crop: 'Mustard', transactions: 156 },
      { crop: 'Cotton', transactions: 134 },
    ],
  },
};

// ============ STUDENT MOCK DATA ============
export const studentMockData = {
  student: {
    id: 'STUDENT001',
    name: 'Harsh Verma',
    email: 'harsh@student.edu',
    university: 'Agricultural University Delhi',
    semester: '6th',
    degreeProgram: 'B.Sc. Agriculture',
    avatar: '👨‍🎓',
  },

  realTimeMarketData: [
    {
      crop: 'Wheat',
      currentPrice: 2500,
      priceChange: '+2.5%',
      trend: 'up',
      volume: '1,250 Quintals',
      location: 'Punjab Mandi',
    },
    {
      crop: 'Rice',
      currentPrice: 3000,
      priceChange: '-1.2%',
      trend: 'down',
      volume: '950 Quintals',
      location: 'West Bengal Mandi',
    },
    {
      crop: 'Mustard',
      currentPrice: 4500,
      priceChange: '+0.8%',
      trend: 'up',
      volume: '450 Quintals',
      location: 'Haryana Mandi',
    },
  ],

  marketAnalytics: {
    demandTrends: [
      { crop: 'Wheat', demand: 'High', regions: ['Punjab', 'Haryana', 'UP'] },
      { crop: 'Rice', demand: 'Very High', regions: ['Bengal', 'Bihar', 'Odisha'] },
      { crop: 'Cotton', demand: 'Medium', regions: ['Gujarat', 'Maharashtra'] },
    ],
    seasonalPatterns: [
      { season: 'Kharif', topCrops: ['Rice', 'Cotton', 'Maize'] },
      { season: 'Rabi', topCrops: ['Wheat', 'Mustard', 'Pulses'] },
      { season: 'Summer', topCrops: ['Vegetables', 'Fruits'] },
    ],
  },

  learningResources: [
    {
      id: 1,
      title: 'Modern Crop Management Techniques',
      description: 'Learn about precision farming and crop optimization',
      type: 'Video',
      duration: '45 min',
      completed: true,
    },
    {
      id: 2,
      title: 'Soil Health and Sustainability',
      description: 'Understanding soil composition and sustainable practices',
      type: 'Article',
      duration: '20 min read',
      completed: true,
    },
    {
      id: 3,
      title: 'Integrated Pest Management',
      description: 'Strategies for effective pest control',
      type: 'Interactive Module',
      duration: '60 min',
      completed: false,
    },
  ],
};

// ============ PLANT DISEASE DETECTION DATA ============
export const diseaseDetectionData = {
  detectionResults: [
    {
      id: 1,
      disease: 'Early Blight',
      confidence: 92,
      severity: 'Moderate',
      affectedArea: '35%',
      recommendation: 'Apply fungicide within 48 hours. Remove affected leaves.',
      cropType: 'Wheat',
    },
    {
      id: 2,
      disease: 'Healthy',
      confidence: 95,
      severity: 'None',
      affectedArea: '0%',
      recommendation: 'Continue regular monitoring',
      cropType: 'Rice',
    },
  ],

  commonDiseases: [
    { name: 'Early Blight', symptoms: 'Brown spots with concentric rings', treatment: 'Fungicide spray' },
    { name: 'Powdery Mildew', symptoms: 'White powder on leaves', treatment: 'Sulfur or triazole spray' },
    { name: 'Leaf Rust', symptoms: 'Orange/brown pustules', treatment: 'Rust-resistant varieties' },
    { name: 'Mosaic Virus', symptoms: 'Yellow mottling on leaves', treatment: 'Remove infected plants' },
  ],
};

// ============ NEWS DATA ============
export const newsData = [
  {
    id: 1,
    title: 'New Organic Farming Subsidies Announced',
    content: 'Government launches new scheme to support organic farming with 50% subsidy',
    date: '2026-02-15',
    category: 'Policy',
    image: '📋',
    source: 'Ministry of Agriculture',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'Water Conservation Techniques for Dry Seasons',
    content: 'Experts share best practices for water management during droughts',
    date: '2026-02-14',
    category: 'Technology',
    image: '💧',
    source: 'Agricultural Research Institute',
    readTime: '8 min',
  },
  {
    id: 3,
    title: 'Climate Change Impacts on Crop Yields',
    content: 'Study reveals changing patterns in agricultural productivity',
    date: '2026-02-13',
    category: 'Research',
    image: '🌍',
    source: 'Climate Research Center',
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'Market Prices Rise for Premium Vegetables',
    content: 'Demand surge drives up prices for organic produce in major cities',
    date: '2026-02-12',
    category: 'Market',
    image: '📈',
    source: 'Agricultural Marketing',
    readTime: '4 min',
  },
];

// ============ WEATHER & HARVEST DATA ============
export const weatherPredictionData = [
  {
    day: 'Monday',
    date: '2026-02-17',
    high: 28,
    low: 15,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    precipitation: 0,
    uvIndex: 6,
  },
  {
    day: 'Tuesday',
    date: '2026-02-18',
    high: 26,
    low: 14,
    condition: 'Cloudy',
    humidity: 72,
    windSpeed: 15,
    precipitation: 5,
    uvIndex: 5,
  },
  {
    day: 'Wednesday',
    date: '2026-02-19',
    high: 24,
    low: 12,
    condition: 'Rainy',
    humidity: 85,
    windSpeed: 20,
    precipitation: 45,
    uvIndex: 2,
  },
];

export const harvestPredictionData = {
  crops: [
    {
      cropName: 'Wheat',
      area: 10,
      sowingDate: '2025-11-15',
      expectedHarvestDate: '2026-04-15',
      daysToHarvest: 58,
      estimatedYield: 42,
      unit: 'Quintals',
      costPerUnit: 800,
      expectedRevenue: 33600,
      notes: 'Optimal conditions, early maturity possible',
    },
    {
      cropName: 'Mustard',
      area: 7,
      sowingDate: '2025-10-10',
      expectedHarvestDate: '2026-03-15',
      daysToHarvest: 27,
      estimatedYield: 28,
      unit: 'Quintals',
      costPerUnit: 1200,
      expectedRevenue: 33600,
      notes: 'Good health, slight disease risk',
    },
  ],
};

// ============ PAYMENT DATA ============
export const paymentData = {
  paymentMethods: [
    { id: 1, name: 'Credit Card', icon: '💳', isActive: true },
    { id: 2, name: 'Debit Card', icon: '💳', isActive: true },
    { id: 3, name: 'Bank Transfer', icon: '🏦', isActive: true },
    { id: 4, name: 'Digital Wallet', icon: '📱', isActive: true },
  ],

  transactionHistory: [
    {
      id: 'TXN001',
      description: 'Payment for Wheat Purchase',
      amount: 125000,
      date: '2026-02-15',
      status: 'Completed',
      orderId: 'ORDER001',
    },
    {
      id: 'TXN002',
      description: 'Payment for Rice Purchase',
      amount: 300000,
      date: '2026-02-10',
      status: 'Completed',
      orderId: 'ORDER002',
    },
  ],
};

// ============ MESSAGING DATA ============
export const messagingData = {
  conversations: [
    {
      id: 'CONV001',
      participantName: 'Rajesh Kumar',
      participantRole: 'Farmer',
      participantAvatar: '👨‍🌾',
      lastMessage: 'Wheat harvest ready by April 15',
      lastMessageTime: '2026-02-15 14:30',
      unreadCount: 2,
      onlineStatus: 'Online',
    },
    {
      id: 'CONV002',
      participantName: 'Arjun Patel',
      participantRole: 'Buyer',
      participantAvatar: '👨‍💼',
      lastMessage: 'Can you accommodate rush delivery?',
      lastMessageTime: '2026-02-15 10:15',
      unreadCount: 0,
      onlineStatus: 'Away',
    },
    {
      id: 'CONV003',
      participantName: 'Priya Singh',
      participantRole: 'Farmer',
      participantAvatar: '👩‍🌾',
      lastMessage: 'Thank you for the order confirmation',
      lastMessageTime: '2026-02-14 16:45',
      unreadCount: 0,
      onlineStatus: 'Offline',
    },
  ],

  messages: {
    CONV001: [
      {
        id: 1,
        sender: 'Rajesh Kumar',
        senderType: 'farmer',
        timestamp: '2026-02-15 14:30',
        message: 'Wheat harvest ready by April 15. Quality is premium. Please confirm purchase interest.',
        read: true,
      },
      {
        id: 2,
        sender: 'You',
        senderType: 'user',
        timestamp: '2026-02-15 14:45',
        message: 'Yes, please reserve 50 quintals for us. What is your pricing?',
        read: true,
      },
      {
        id: 3,
        sender: 'Rajesh Kumar',
        senderType: 'farmer',
        timestamp: '2026-02-15 15:00',
        message: 'Pricing: ₹2500 per quintal. Can offer bulk discount of 5% for 100+ quintals.',
        read: true,
      },
    ],
  },
};
