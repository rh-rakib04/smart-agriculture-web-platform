# Farmer Dashboard - Complete Documentation

**Last Updated**: March 2026  
**Status**: Production Ready  
**Version**: 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Pages & Components](#frontend-pages--components)
4. [Backend API Implementation](#backend-api-implementation)
5. [Database Schema](#database-schema)
6. [Custom Hooks & Context](#custom-hooks--context)
7. [Component Library](#component-library)
8. [Data Flow & Workflows](#data-flow--workflows)
9. [Security & Role Management](#security--role-management)
10. [Usage Guide](#usage-guide)
11. [Development & Maintenance](#development--maintenance)

---

## Overview

The **Farmer Dashboard** is a comprehensive web-based platform designed for agricultural professionals to manage their farming operations, track expenses, monitor weather, detect crop diseases, and participate in an online marketplace for selling crops.

### Key Features

- 📊 **Dashboard Analytics**: Real-time statistics and visual reporting
- 🌾 **Crop Management**: Add, edit, and manage crop listings
- 💰 **Expense Tracking**: Monitor farming expenses by category
- 🌍 **Weather Integration**: Real-time weather data and 7-day forecasts
- 🌱 **Farm Planning**: Step-by-step farm planning wizard
- 📱 **Messaging**: Direct messaging between farmers and buyers
- 🔍 **Disease Detection**: Plant disease identification interface
- 💹 **Profit Calculator**: Income and expense analysis tools

### Technology Stack

- **Frontend**: Next.js 13+, React, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB
- **Visualization**: Recharts
- **Authentication**: NextAuth.js + Custom JWT
- **Styling**: Framer Motion, Lucide React Icons
- **State Management**: React Context API

---

## Architecture

### Directory Structure

```
src/
├── app/(dashboard)
│   └── farmer/
│       ├── layout.jsx                  # Role-enforced wrapper
│       ├── page.jsx                    # Dashboard home page
│       ├── weather/page.jsx            # Weather information
│       ├── plantDisease/page.jsx       # Disease detection
│       ├── planner/page.jsx            # Farm planning wizard
│       ├── messages/page.jsx           # Messaging system
│       ├── calculator/page.jsx         # Profit calculator
│       ├── add-product/page.jsx        # Add crop listings
│       └── manage-products/page.jsx    # Edit/delete crops
│
├── components/
│   ├── farmer/                         # Farmer-specific components
│   │   ├── sidebar.jsx
│   │   ├── Weather/
│   │   ├── planner/
│   │   ├── CropCard.js
│   │   ├── WeatherDisplay.js
│   │   ├── AIRecommendations.js
│   │   └── PlantDiseasePage.js
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── layout/
│   └── shared/
│
├── hooks/
│   ├── useAuth.js           # Authentication state
│   ├── useRole.js           # Role management
│   ├── useCrops.js          # Crop operations
│   ├── useExpenses.js       # Expense management
│   ├── useMessages.js       # Messaging
│   ├── useWeather.js        # Weather data
│   └── usePlanDownload.js   # Plan PDF export
│
├── contexts/
│   ├── AuthProvider.jsx     # Authentication context
│   ├── NotificationContext.jsx
│   └── ThemeContext.jsx
│
├── lib/
│   ├── api/
│   │   ├── endpoints.js     # API endpoint definitions
│   │   └── ... (services)
│   ├── db/
│   │   ├── collections.js   # MongoDB collections
│   │   └── ... (queries)
│   ├── utils/
│   ├── validators/
│   ├── services/
│   └── constants/
│
└── app/api/
    └── dashboard/
        ├── stats/route.js            # Dashboard statistics
        ├── ... (other endpoints)
```

---

## Frontend Pages & Components

### 1. Dashboard Home Page
**File**: `src/app/(dashboard)/farmer/page.jsx`

**Purpose**: Main dashboard landing page with analytics overview

**Features**:
- 📈 Real-time statistics cards (Total Crops, Orders, Expenses, Profit)
- 📊 Area chart for monthly revenue/expense trends
- 📉 Bar chart for orders over time
- 🥧 Pie chart for order status distribution
- 📋 Activity timeline showing recent transactions
- 🔄 Auto-refresh statistics

**Component Structure**:
```jsx
Dashboard Page
├── StatCards (4 main KPIs)
├── Charts Section
│   ├── AreaChart (Revenue vs Expenses)
│   ├── BarChart (Orders Timeline)
│   └── PieChart (Order Status)
└── Activity Section
    └── Timeline (Recent Orders)
```

**API Used**: `GET /api/dashboard/stats?farmerId={id}`

**Data Contract**:
```javascript
{
  totalCrops: number,
  totalOrders: number,
  totalExpenses: number,
  calculatedProfit: number,
  monthlyData: [
    { month: string, revenue: number, expenses: number },
    ...
  ],
  orderDistribution: {
    pending: number,
    approved: number,
    completed: number,
    rejected: number
  },
  activityTimeline: Array<{
    date: Date,
    action: string,
    details: string
  }>,
  recentOrders: Array<Order>
}
```

---

### 2. Weather Page
**File**: `src/app/(dashboard)/farmer/weather/page.jsx`

**Purpose**: Display real-time weather and forecasts for farming decisions

**Features**:
- 🌡️ Current weather conditions with temperature and humidity
- 📅 7-day detailed forecast
- ⚠️ Farming alerts and recommendations
- 🎯 Location-based weather data
- 🌬️ Wind speed, UV index, and precipitation data

**Component Structure**:
```jsx
Weather Page
├── LocationSelector (Division/District/Upazila)
├── CurrentWeatherCard
│   ├── Temperature Display
│   ├── Humidity
│   ├── Wind Speed
│   └── Condition Icon
├── ForecastCards (7 days)
│   └── Daily forecast with high/low temps
└── FarmingAlerts
    ├── Irrigation alerts
    ├── Pest warnings
    └── Harvest timing
```

**API Used**: 
- `GET /api/weather/current?location={id}`
- `GET /api/weather/forecast?location={id}`

---

### 3. Plant Disease Detection
**File**: `src/app/(dashboard)/farmer/plantDisease/page.jsx`

**Purpose**: AI-powered crop disease identification tool

**Features**:
- 🖼️ Image upload functionality with drag-drop support
- 🌾 20+ crop type selector (Rice, Wheat, Corn, Cotton, etc.)
- 🔍 Disease detection analysis
- 📊 Confidence score and severity rating
- 💊 Treatment recommendations
- 📚 Disease information and prevention tips

**Component Structure**:
```jsx
Plant Disease Detection
├── CropTypeSelector
│   └── Animated crop grid (Rabi/Kharif seasons)
├── ImageUploadZone
│   ├── File input
│   ├── Drag-drop area
│   └── Image preview
└── DetectionResults
    ├── Disease name
    ├── Confidence score
    ├── Severity level
    ├── Description
    └── Treatment recommendations
```

**Image Upload Support**:
- Accepted formats: JPG, PNG, WebP
- Max file size: 5MB
- Stored in: `/public/uploads/`

---

### 4. Farm Planning Wizard
**File**: `src/app/(dashboard)/farmer/planner/page.jsx`

**Purpose**: Multi-step farm planning tool for seasonal crop planning

**Features**:
- 📝 3-step interactive wizard
- 🌾 Smart crop recommendations based on season
- 📍 Location-based planning
- 🌤️ Weather-aware timing
- 📥 Plan download as PDF
- 💾 Plan storage and history

**Step-by-Step Breakdown**:

**Step 1: Crop Selection**
- Animated season selector (Rabi, Kharif_1, Kharif_2)
- Filtered crop list based on selected season
- Crop details: Name, Water Requirements, Expected Yield
- Multiple crop selection allowed

**Step 2: Location Selection**
- Division selector (8 divisions)
- District selector (64 districts)
- Upazila selector (490+ upazilas)
- Soil type and pH level info

**Step 3: Land Details**
- Land area in hectares/bighas
- Elevation and slope
- Soil condition assessment
- Water source availability
- Equipment checklist

**Final Result Page**:
- Plan summary with selected crops, location, and timeline
- Planting calendar with dates
- Resource requirement estimates
- Weather forecast for planning period
- Download as PDF option

**Component Hierarchy**:
```jsx
Planner Page
├── StepIndicator (Progress bar)
├── Step 1: StepOne Component
├── Step 2: StepTwo Component
├── Step 3: StepThree Component
└── PlanResult Component
    ├── Summary cards
    ├── Calendar view
    ├── Weather integration
    └── PDF download button
```

**API Used**: `POST /api/planner`

---

### 5. Messages Page
**File**: `src/app/(dashboard)/farmer/messages/page.jsx`

**Purpose**: Direct messaging between farmers and buyers

**Features**:
- 💬 Real-time messaging interface
- 👥 Conversation list with unread indicators
- 🔍 Search and filter conversations
- 🗑️ Delete message and conversation options
- 📱 Responsive design for mobile
- ⏰ Timestamp on all messages

**Component Structure**:
```jsx
Messages Page
├── ConversationList
│   ├── Search/Filter bar
│   └── Conversation items
│       └── Last message preview
├── ChatWindow
│   ├── Header (User info)
│   ├── Message list
│   ├── Message input
│   └── Send button
└── ActionButtons
    ├── Delete message
    ├── Clear conversation
    └── Block user
```

**API Endpoints**:
- `GET /api/messages?userId={id}&limit=50` - Fetch conversations
- `POST /api/messages` - Send new message
- `DELETE /api/messages/{conversationId}?messageId={msgId}` - Delete message

**Data Contract**:
```javascript
// Message object
{
  _id: ObjectId,
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  recipientId: string,
  content: string,
  timestamp: Date,
  read: boolean,
  attachments: Array
}
```

---

### 6. Add Product Page
**File**: `src/app/(dashboard)/farmer/add-product/page.jsx`

**Purpose**: Upload and list crops for marketplace sale

**Features**:
- 📸 Multiple image upload with preview
- 🏷️ Crop details form (name, type, category)
- 💵 Price and quantity management
- 📍 Harvesting location
- 🌾 Crop variety and grade selection
- ✨ Rich description editor
- 📋 Form validation

**Form Fields**:
```javascript
{
  title: string,              // Crop name
  category: string,           // Crop type (Rice, Wheat, etc.)
  subCategory: string,        // Variety
  grade: enum,                // Quality grade (A, B, C)
  price: number,              // Per unit price (TK)
  quantity: number,           // Available quantity
  unit: string,               // kg, ton, basket, etc.
  description: string,        // Rich text description
  harvestDate: Date,          // When harvested
  harvestLocation: string,    // Location details
  images: File[],             // Crop photos
  certifications: string[],   // Organic, etc.
  storage: string,            // Storage conditions
  minOrderQuantity: number    // Minimum order
}
```

**Image Upload**:
- Stored in: `/public/uploads/crops/`
- Formats: JPG, PNG, WebP
- Auto-compress to 800x600 width
- Multiple images per product

**API Used**: `POST /api/crops`

---

### 7. Manage Products Page
**File**: `src/app/(dashboard)/farmer/manage-products/page.jsx`

**Purpose**: Edit, update, and manage existing crop listings

**Features**:
- 📋 Table view of all farmer's crops
- ✏️ In-line editing or modal form
- 🗑️ Delete products with confirmation
- 📊 Stock status indicators
- 🔍 Search and filter crops
- 📄 Pagination (20 items per page)
- ⭐ View analytics on individual crops

**Table Columns**:
- Crop image thumbnail
- Crop name and type
- Quantity available
- Price per unit
- Creation date
- Status (Active/Draft/Sold Out)
- Edit/Delete actions

**Edit Modal**:
- Pre-fills all product data
- Allows image replacement
- Price and quantity updates
- Status change dropdown

**API Used**:
- `GET /api/crops?farmerId={id}&status=active` - Fetch products
- `PUT /api/crops/{id}` - Update product
- `DELETE /api/crops/{id}` - Delete product

---

### 8. Calculator Page
**File**: `src/app/(dashboard)/farmer/calculator/page.jsx`

**Purpose**: Income and expense analysis tool

**Features**:
- 💰 Revenue calculator
- 📊 Expense categorization
- 📈 Profit/Loss analysis
- 📅 Time period selection
- 🎯 Cost per unit calculations
- 💹 ROI estimation

**Calculator Sections**:
1. **Income Input**
   - Crop selection
   - Quantity harvested
   - Price per unit
   - Auto-calculated total

2. **Expense Breakdown**
   - Seeds & saplings
   - Fertilizers & pesticides
   - Labor costs
   - Equipment rental
   - Transportation
   - Water and electricity

3. **Analysis Output**
   - Total revenue
   - Total expenses
   - Net profit/loss
   - Profit margin percentage
   - Cost per unit
   - Break-even analysis

**API Used**: `GET /api/expenses/analytics?farmerId={id}`

---

## Backend API Implementation

### API Architecture Overview

All API endpoints are built using Next.js API Routes and follow RESTful conventions. Each endpoint:
- ✅ Validates request data
- ✅ Enforces role-based access control
- ✅ Interacts with MongoDB
- ✅ Returns consistent JSON responses
- ✅ Implements error handling

### Response Format

**Success Response**:
```javascript
{
  success: true,
  data: { /* endpoint-specific data */ },
  message: "Operation completed successfully"
}
```

**Error Response**:
```javascript
{
  success: false,
  error: "Error message describing what went wrong",
  statusCode: 400,
  details: { /* validation errors or additional info */ }
}
```

---

### Dashboard Endpoints

#### GET `/api/dashboard/stats`

**Purpose**: Fetch comprehensive dashboard statistics

**Query Parameters**:
```
farmerId: string (required) - ID of the farmer
dateRange: string (optional) - 'week', 'month', 'year', 'all'
```

**Response**:
```javascript
{
  success: true,
  data: {
    totalCrops: 15,
    totalOrders: 128,
    totalExpenses: 45000,
    calculatedProfit: 120000,
    monthlyData: [
      {
        month: "January",
        revenue: 50000,
        expenses: 15000
      },
      // ... 11 more months
    ],
    orderDistribution: {
      pending: 10,
      approved: 45,
      completed: 68,
      rejected: 5
    },
    activityTimeline: [
      {
        date: "2026-03-25T10:30:00Z",
        action: "Order received",
        details: "Rice 50kg from Buyer ID XYZ"
      },
      // ... more activities
    ],
    recentOrders: [
      {
        _id: "...",
        cropId: "...",
        buyerId: "...",
        quantity: 50,
        price: 2000,
        status: "pending",
        createdAt: "2026-03-25T10:30:00Z"
      },
      // ... up to 5 recent orders
    ]
  }
}
```

**Implementation** (`src/app/api/dashboard/stats/route.js`):
```javascript
import { getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (req, { params }) => {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        error: 'farmerId is required'
      });
    }

    // Fetch data from multiple collections
    const cropsCollection = getCollection('crops');
    const ordersCollection = getCollection('orders');
    const expensesCollection = getCollection('expenses');

    const [crops, orders, expenses] = await Promise.all([
      cropsCollection.countDocuments({ farmerId, status: 'active' }),
      ordersCollection.find({ farmerId }).toArray(),
      expensesCollection.find({ farmerId }).toArray()
    ]);

    // Calculate metrics
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, ord) => sum + ord.totalPrice, 0);

    const monthlyData = aggregateMonthlyData(orders, expenses);
    const activityTimeline = generateActivityTimeline(orders, expenses);

    return res.status(200).json({
      success: true,
      data: {
        totalCrops: crops,
        totalOrders: orders.length,
        totalExpenses,
        calculatedProfit: totalRevenue - totalExpenses,
        monthlyData,
        activityTimeline,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});
```

---

### Crop Management Endpoints

#### GET `/api/crops`

**Purpose**: Fetch crop listings with filtering and pagination

**Query Parameters**:
```
farmerId: string (optional)     - Filter by farmer
search: string (optional)       - Search by crop name
category: string (optional)     - Filter by category (Rice, Wheat, etc.)
status: string (optional)       - Filter by status (active, draft, sold)
minPrice: number (optional)     - Price range minimum
maxPrice: number (optional)     - Price range maximum
page: number (default: 1)       - Pagination page
limit: number (default: 20)     - Items per page
```

**Response**:
```javascript
{
  success: true,
  data: {
    crops: [
      {
        _id: "507f1f77bcf86cd799439011",
        farmerId: "...",
        farmerName: "Ahmed Farm",
        title: "Basmati Rice",
        category: "Rice",
        subCategory: "Basmati",
        grade: "A",
        price: 50000,
        quantity: 500,
        unit: "kg",
        description: "Premium quality basmati rice",
        images: ["url1", "url2"],
        harvestDate: "2026-03-15",
        status: "active",
        createdAt: "2026-03-20T08:00:00Z",
        updatedAt: "2026-03-25T10:00:00Z"
      },
      // ... more crops
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalCrops: 95,
      limit: 20
    }
  }
}
```

**Implementation**:
```javascript
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    const query = { status: 'active' };
    if (farmerId) query.farmerId = farmerId;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const collection = getCollection('crops');
    const skip = (page - 1) * limit;

    const [crops, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        crops,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCrops: total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Crops fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch crops'
    });
  }
};
```

---

#### POST `/api/crops`

**Purpose**: Create a new crop listing

**Request Body**:
```javascript
{
  farmerId: string,
  title: string,              // Crop name (required)
  category: string,           // Crop type (required)
  subCategory: string,        // Variety
  grade: string,              // Quality grade (A, B, C)
  price: number,              // Price per unit (required)
  quantity: number,           // Available quantity (required)
  unit: string,               // kg, ton, basket, etc.
  description: string,        // Description (required)
  harvestDate: Date,          // Harvest date
  harvestLocation: string,    // Location
  images: string[],           // Image URLs
  certifications: string[],   // Organic, etc.
  minOrderQuantity: number,   // Minimum order
  storage: string             // Storage info
}
```

**Response**:
```javascript
{
  success: true,
  data: {
    _id: "507f1f77bcf86cd799439011",
    // ... all crop fields
    createdAt: "2026-03-25T10:30:00Z"
  },
  message: "Crop added successfully"
}
```

---

#### PUT `/api/crops/{id}`

**Purpose**: Update an existing crop

**Request Body**: Same as POST (all fields optional)

**Response**: Updated crop object

---

#### DELETE `/api/crops/{id}`

**Purpose**: Delete a crop listing

**Parameters**:
```
id: string - Crop ID (in URL)
```

**Response**:
```javascript
{
  success: true,
  message: "Crop deleted successfully"
}
```

---

### Expense Management Endpoints

#### GET `/api/expenses`

**Purpose**: Fetch expenses for a farmer

**Query Parameters**:
```
farmerId: string (required)  - Filter by farmer
cropId: string (optional)    - Filter by crop
startDate: Date (optional)   - Date range start
endDate: Date (optional)     - Date range end
category: string (optional)  - Expense category
page: number (default: 1)
limit: number (default: 50)
```

**Response**:
```javascript
{
  success: true,
  data: {
    expenses: [
      {
        _id: "...",
        farmerId: "...",
        cropId: "...",
        category: "seeds",          // seeds, fertilizer, labor, equipment
        description: "Basmati seed",
        amount: 5000,
        date: "2026-01-15",
        paymentMethod: "cash",
        notes: "Purchased from local dealer"
      },
      // ... more expenses
    ],
    summary: {
      totalExpenses: 45000,
      byCategory: {
        seeds: 5000,
        fertilizer: 12000,
        labor: 20000,
        equipment: 8000
      }
    }
  }
}
```

---

#### POST `/api/expenses`

**Purpose**: Record a new expense

**Request Body**:
```javascript
{
  farmerId: string,           // (required)
  cropId: string,             // (required)
  category: string,           // seeds, fertilizer, labor, equipment, other
  description: string,        // (required)
  amount: number,             // (required)
  date: Date,                 // (default: today)
  paymentMethod: string,      // cash, check, bank_transfer
  notes: string               // Additional notes
}
```

---

#### GET `/api/expenses/analytics`

**Purpose**: Fetch expense analytics and trends

**Query Parameters**:
```
farmerId: string (required)
dateRange: string (optional) - 'week', 'month', 'year', 'all'
```

**Response**:
```javascript
{
  success: true,
  data: {
    totalExpenses: 45000,
    averageMonthly: 3750,
    categoryBreakdown: {
      seeds: { amount: 5000, percentage: 11.1 },
      fertilizer: { amount: 12000, percentage: 26.7 },
      labor: { amount: 20000, percentage: 44.4 },
      equipment: { amount: 8000, percentage: 17.8 }
    },
    monthlyTrends: [
      { month: "January", amount: 4000 },
      // ... 11 more months
    ],
    topExpenses: [
      { description: "Labor - harvesting", amount: 8000 },
      // ... top 5 expenses
    ]
  }
}
```

---

### Messaging Endpoints

#### GET `/api/messages`

**Purpose**: Fetch conversations for a user

**Query Parameters**:
```
userId: string (required)  - Current user ID
limit: number (default: 50) - Max conversations to fetch
offset: number (default: 0) - Pagination offset
```

**Response**:
```javascript
{
  success: true,
  data: {
    conversations: [
      {
        conversationId: "conv_123",
        participantId: "user_456",
        participantName: "Ali Buyer",
        participantAvatar: "url",
        lastMessage: "When will the rice be ready?",
        lastMessageTime: "2026-03-25T10:30:00Z",
        unreadCount: 2,
        messages: [
          {
            _id: "msg_1",
            senderId: "...",
            content: "I have 100kg rice available",
            timestamp: "2026-03-24T15:00:00Z",
            read: true
          },
          // ... more messages
        ]
      },
      // ... more conversations
    ]
  }
}
```

---

#### POST `/api/messages`

**Purpose**: Send a new message

**Request Body**:
```javascript
{
  senderId: string,         // Current user ID
  senderName: string,       // Sender's name
  senderAvatar: string,     // Sender's avatar URL
  recipientId: string,      // Recipient user ID
  content: string,          // Message text (required)
  conversationId: string,   // Existing conversation ID
  attachments: string[]     // File URLs (optional)
}
```

**Response**:
```javascript
{
  success: true,
  data: {
    _id: "msg_123",
    conversationId: "conv_123",
    // ... all message fields
  },
  message: "Message sent successfully"
}
```

---

#### DELETE `/api/messages/{conversationId}`

**Purpose**: Delete a specific message or entire conversation

**Query Parameters**:
```
messageId: string (optional) - Specific message to delete
```

**Response**:
```javascript
{
  success: true,
  message: "Message deleted successfully"
}
```

---

### Weather Endpoints

#### GET `/api/weather/current`

**Purpose**: Get current weather for a location

**Query Parameters**:
```
location: string (required) - Location ID or coordinates
```

**Response**:
```javascript
{
  success: true,
  data: {
    location: "Dhaka, Bangladesh",
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    condition: "Partly Cloudy",
    icon: "cloud-sun",
    feelsLike: 32,
    precipitation: 0,
    visibility: 10,
    pressure: 1013
  }
}
```

---

#### GET `/api/weather/forecast`

**Purpose**: Get 7-day weather forecast

**Query Parameters**:
```
location: string (required) - Location ID
```

**Response**:
```javascript
{
  success: true,
  data: [
    {
      date: "2026-03-26",
      highTemp: 32,
      lowTemp: 22,
      condition: "Sunny",
      humidity: 60,
      precipitation: 0,
      windSpeed: 10,
      icon: "sun"
    },
    // ... 6 more days
  ]
}
```

---

### Farm Planning Endpoints

#### POST `/api/planner`

**Purpose**: Save a farm plan

**Request Body**:
```javascript
{
  farmerId: string,
  cropIds: string[],          // Selected crops
  location: {
    division: string,
    district: string,
    upazila: string,
    soilType: string,
    soilPH: number,
    elevation: number
  },
  landDetails: {
    areaHectares: number,
    areaOtherUnit: number,
    waterSource: string,
    slope: string,
    prepped: boolean
  },
  plannedStartDate: Date,
  plannedEndDate: Date,
  notes: string
}
```

**Response**:
```javascript
{
  success: true,
  data: {
    _id: "plan_123",
    // ... all plan fields
    createdAt: "2026-03-25T10:30:00Z"
  },
  message: "Plan saved successfully"
}
```

---

#### GET `/api/planner/{farmerId}`

**Purpose**: Fetch farmer's saved plans

**Response**:
```javascript
{
  success: true,
  data: [
    {
      _id: "plan_123",
      cropNames: ["Rice", "Wheat"],
      location: "Dhaka Division",
      startDate: "2026-04-01",
      endDate: "2026-07-31",
      createdAt: "2026-03-25T10:30:00Z"
    },
    // ... more plans
  ]
}
```

---

## Database Schema

### Collections Overview

All collections are stored in MongoDB with the following schemas:

---

### Crops Collection

```javascript
{
  _id: ObjectId,
  farmerId: string,           // Reference to farmers/users
  farmerName: string,         // Denormalized farmer name
  title: string,              // Crop name
  category: string,           // Type: Rice, Wheat, Corn, Cotton, etc.
  subCategory: string,        // Variety: Basmati, Jasmine, etc.
  grade: string,              // A, B, C quality grades
  price: number,              // Price per unit
  quantity: number,           // Current available quantity
  unit: string,               // kg, ton, basket, etc.
  description: string,        // Rich text description
  images: [string],           // Array of image URLs
  harvestDate: Date,          // When the crop was harvested
  harvestLocation: string,    // Location description
  status: string,             // active, draft, sold, archived
  certifications: [string],   // organic, pesticide-free, etc.
  minOrderQuantity: number,   // Minimum quantity per order
  storage: string,            // Storage conditions/requirements
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  createdBy: string,          // User ID who listed
  
  // Indexing
  _index: [
    { farmerId: 1 },
    { category: 1 },
    { status: 1, createdAt: -1 },
    { title: "text", description: "text" }
  ]
}
```

---

### Expenses Collection

```javascript
{
  _id: ObjectId,
  farmerId: string,           // Reference to farmers/users
  cropId: string,             // Reference to crop (optional)
  cropName: string,           // Denormalized crop name
  category: string,           // seeds, fertilizer, labor, equipment, water, electricity, other
  description: string,        // Detailed description
  amount: number,             // Expense amount (in TK)
  date: Date,                 // Date of expense
  paymentMethod: string,      // cash, check, bank_transfer, mobile_banking
  notes: string,              // Additional notes
  receipt: string,            // Receipt image URL (optional)
  vendor: string,             // Vendor name (optional)
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  
  // Indexing
  _index: [
    { farmerId: 1, date: -1 },
    { category: 1 },
    { cropId: 1 }
  ]
}
```

---

### Orders Collection

```javascript
{
  _id: ObjectId,
  farmerId: string,           // Seller (farmer)
  farmerName: string,
  buyerId: string,            // Buyer user ID
  buyerName: string,
  cropId: string,             // Reference to crop
  cropName: string,
  quantity: number,           // Ordered quantity
  unit: string,               // kg, ton, basket, etc.
  pricePerUnit: number,       // Price at time of order
  totalPrice: number,         // quantity * pricePerUnit
  status: string,             // pending, approved, completed, rejected, cancelled
  paymentMethod: string,      // advance, cod, online, etc.
  paymentStatus: string,      // unpaid, partial, paid
  deliveryDate: Date,         // Expected delivery
  deliveryLocation: string,   // Buyer's address
  notes: string,              // Order notes/requirements
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  
  // Indexing
  _index: [
    { farmerId: 1, status: 1 },
    { buyerId: 1 },
    { createdAt: -1 },
    { status: 1, updatedAt: -1 }
  ]
}
```

---

### Messages Collection

```javascript
{
  _id: ObjectId,
  conversationId: string,     // Unique conversation identifier
  participants: [string],     // Array of user IDs in conversation
  senderId: string,           // User who sent message
  senderName: string,
  senderAvatar: string,
  recipientId: string,        // Target recipient
  content: string,            // Message text
  attachments: [{             // Optional attachments
    url: string,
    type: string,             // image, file, etc.
    name: string
  }],
  read: boolean,              // Whether recipient has read
  readAt: Date,
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,            // Soft delete timestamp
  
  // Indexing
  _index: [
    { conversationId: 1, createdAt: -1 },
    { participants: 1 },
    { senderId: 1 },
    { read: 1, recipientId: 1 }
  ]
}
```

---

### Farm Plans Collection

```javascript
{
  _id: ObjectId,
  farmerId: string,
  cropIds: [string],          // Selected crops
  cropNames: [string],        // Denormalized names
  location: {
    division: string,
    district: string,
    upazila: string,
    soilType: string,         // clay, sandy, loam, etc.
    soilPH: number,           // 1-14 scale
    elevation: number,        // Meters above sea level
    coordinates: {
      lat: number,
      lng: number
    }
  },
  landDetails: {
    areaHectares: number,
    areaOtherUnit: number,
    otherUnitType: string,    // bigha, decimal, etc.
    waterSource: string,      // irrigation, rainfall, well, canal, etc.
    slope: string,            // flat, gentle, steep
    soilCondition: string,    // good, fair, poor
    isPrepped: boolean
  },
  plannedStartDate: Date,
  plannedEndDate: Date,
  estimatedYield: number,     // Estimated harvest amount
  estimatedRevenue: number,
  waterRequirement: number,   // Liters/cubic meters
  laborDays: number,          // Estimated labor days
  notes: string,
  status: string,             // draft, active, completed, archived
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  
  // Indexing
  _index: [
    { farmerId: 1, createdAt: -1 },
    { status: 1 }
  ]
}
```

---

### Users Collection (Farmer Profile)

```javascript
{
  _id: ObjectId,
  email: string,              // Unique email
  role: string,               // farmer, buyer, admin, student
  
  // Profile Information
  firstName: string,
  lastName: string,
  phone: string,
  avatar: string,             // Profile photo URL
  
  // Farmer-Specific
  farmName: string,           // Name of farm
  totalLand: number,          // Hectares
  location: {
    division: string,
    district: string,
    upazila: string,
    address: string
  },
  
  // Account Details
  bankAccount: string,
  mobileWallet: string,       // bKash, Nagad, etc.
  documentId: string,         // NID/Passport
  
  // Statistics
  totalCrops: number,         // Marketplace listings
  averageRating: number,      // 1-5 stars
  totalOrders: number,
  joinDate: Date,
  
  // Preferences
  notificationPreferences: {
    email: boolean,
    sms: boolean,
    push: boolean
  },
  
  // Audit fields
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  status: string,             // active, inactive, suspended
  
  // Indexing
  _index: [
    { email: 1, unique: true },
    { role: 1 },
    { 'location.division': 1 }
  ]
}
```

---

## Custom Hooks & Context

### 1. useAuth Hook

**File**: `src/hooks/useAuth.js`

**Purpose**: Access authentication state and user information

**Usage**:
```jsx
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, token, logout } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Redirect to="/login" />;

  return <div>Welcome, {user.firstName}!</div>;
}
```

**Returns**:
```javascript
{
  user: {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    avatar: string,
    // ... more fields
  },
  loading: boolean,
  error: string | null,
  token: string,
  logout: () => void,
  updateUser: (updates) => Promise<void>
}
```

---

### 2. useRole Hook

**File**: `src/hooks/useRole.js`

**Purpose**: Check user role and permissions

**Usage**:
```jsx
import { useRole } from '@/hooks/useRole';

export default function Dashboard() {
  const { isFarmer, isBuyer, isAdmin, is, hasAnyRole } = useRole();

  if (!isFarmer) return <AccessDenied />;

  return (
    <>
      {is('admin') && <AdminPanel />}
      {hasAnyRole(['admin', 'farmer']) && <AdvancedFeatures />}
    </>
  );
}
```

**Returns**:
```javascript
{
  isFarmer: boolean,
  isBuyer: boolean,
  isAdmin: boolean,
  isStudent: boolean,
  is: (role: string) => boolean,
  hasAnyRole: (roles: string[]) => boolean,
  canAccess: (resource: string) => boolean
}
```

---

### 3. useCrops Hook

**File**: `src/hooks/useCrops.js`

**Purpose**: Manage crop listings and marketplace data

**Usage**:
```jsx
import { useCrops } from '@/hooks/useCrops';

export default function CropMarket() {
  const {
    crops,
    loading,
    error,
    refetch,
    fetchCrops,
    addCrop,
    updateCrop,
    deleteCrop
  } = useCrops(farmerId);

  useEffect(() => {
    fetchCrops({
      category: 'Rice',
      minPrice: 40000,
      maxPrice: 60000
    });
  }, []);

  const handleAdd = async (cropData) => {
    try {
      await addCrop(cropData);
      toast.success('Crop added!');
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {crops.map(crop => <CropCard key={crop._id} crop={crop} />)}
    </>
  );
}
```

**Methods**:
```javascript
{
  crops: Crop[],
  loading: boolean,
  error: string | null,
  
  // Methods
  fetchCrops: (filters?: FetchOptions) => Promise<void>,
  refetch: () => Promise<void>,
  addCrop: (cropData: CropInput) => Promise<Crop>,
  updateCrop: (id: string, updates: Partial<CropInput>) => Promise<Crop>,
  deleteCrop: (id: string) => Promise<void>,
  searchCrops: (query: string) => Promise<Crop[]>
}
```

---

### 4. useExpenses Hook

**File**: `src/hooks/useExpenses.js`

**Purpose**: Track and manage farm expenses

**Usage**:
```jsx
import { useExpenses } from '@/hooks/useExpenses';

export default function ExpenseTracker() {
  const {
    expenses,
    summary,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getByCategory
  } = useExpenses(farmerId);

  const handleAdd = async () => {
    await addExpense({
      cropId: '...',
      category: 'seeds',
      description: 'Premium basmati seeds',
      amount: 5000,
      date: new Date()
    });
  };

  return (
    <>
      <div>Total: ৳{summary.totalExpenses}</div>
      <ExpenseChart data={summary.byCategory} />
    </>
  );
}
```

**Methods**:
```javascript
{
  expenses: Expense[],
  summary: {
    totalExpenses: number,
    byCategory: Record<string, number>,
    byMonth: Record<string, number>
  },
  loading: boolean,
  
  // Methods
  addExpense: (expenseData: ExpenseInput) => Promise<Expense>,
  updateExpense: (id: string, updates) => Promise<Expense>,
  deleteExpense: (id: string) => Promise<void>,
  getByCategory: (category: string) => Expense[],
  getByDateRange: (start: Date, end: Date) => Expense[]
}
```

---

### 5. useMessages Hook

**File**: `src/hooks/useMessages.js`

**Purpose**: Manage messaging between farmers and buyers

**Usage**:
```jsx
import { useMessages } from '@/hooks/useMessages';

export default function ChatWindow() {
  const {
    conversations,
    currentMessages,
    loading,
    sendMessage,
    deleteMessage,
    openConversation
  } = useMessages(userId);

  const handleSend = async (content) => {
    await sendMessage({
      recipientId: '...',
      content,
      conversationId: '...'
    });
  };

  return (
    <>
      <ConversationList conversations={conversations} />
      <ChatArea messages={currentMessages} />
    </>
  );
}
```

**Methods**:
```javascript
{
  conversations: Conversation[],
  currentMessages: Message[],
  loading: boolean,
  
  // Methods
  sendMessage: (messageData: MessageInput) => Promise<Message>,
  deleteMessage: (messageId: string) => Promise<void>,
  openConversation: (conversationId: string) => Promise<void>,
  markAsRead: (messageId: string) => Promise<void>,
  searchMessages: (query: string) => Message[]
}
```

---

### 6. useWeather Hook

**File**: `src/hooks/useWeather.js`

**Purpose**: Fetch and manage weather data

**Usage**:
```jsx
import { useWeather } from '@/hooks/useWeather';

export default function WeatherCard() {
  const { current, forecast, loading, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather({ location: 'Dhaka' });
  }, []);

  return (
    <>
      <CurrentWeather data={current} />
      <ForecastChart data={forecast} />
    </>
  );
}
```

**Methods**:
```javascript
{
  current: {
    temperature: number,
    humidity: number,
    condition: string,
    icon: string,
    // ... more fields
  },
  forecast: Array<DayForecast>,
  loading: boolean,
  
  // Methods
  fetchWeather: (options: WeatherOptions) => Promise<void>,
  getCurrentWeather: (location: string) => Promise<Weather>,
  getForecast: (location: string, days: number) => Promise<Forecast[]>
}
```

---

### AuthProvider Context

**File**: `src/contexts/AuthProvider.jsx`

**Purpose**: Global authentication state management

**Features**:
- ✅ User session persistence across page reloads
- ✅ JWT token management
- ✅ NextAuth.js integration
- ✅ Auto logout on token expiration
- ✅ Role-based access control

**Usage**:
```jsx
// In app/layout.js or root component
import { AuthProvider } from '@/contexts/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

// In any component
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  return <div>Hello, {user?.firstName}</div>;
}
```

---

### NotificationContext

**File**: `src/contexts/NotificationContext.jsx`

**Purpose**: Centralized toast and alert management

**Usage**:
```jsx
import { useNotification } from '@/hooks/useNotification';

export default function MyComponent() {
  const { toast, alert } = useNotification();

  const handleSubmit = async () => {
    try {
      await api.post('/endpoint');
      toast.success('Operation completed!');
    } catch (error) {
      toast.error('Something went wrong');
      alert.error('Error Details', error.message);
    }
  };
}
```

---

### ThemeContext

**File**: `src/contexts/ThemeContext.jsx`

**Purpose**: Dark/light mode theme management

**Usage**:
```jsx
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## Component Library

### Key Components Used

#### DaisyUI Components
- **Buttons**: `btn`, `btn-primary`, `btn-success`, `btn-error`
- **Forms**: `input`, `textarea`, `select`, `checkbox`, `radio`
- **Modals**: `modal`, `modal-open`
- **Drawers**: `drawer` (responsive navigation)
- **Cards**: `card`, `card-body`, `card-image`
- **Tables**: `table`, `table-compact`
- **Badges**: `badge`, `badge-lg`, `badge-primary`

#### Recharts Visualizations
```jsx
import { AreaChart, BarChart, PieChart, LineChart } from 'recharts';

// Area Chart (Revenue vs Expenses)
<AreaChart data={monthlyData}>
  <Area type="monotone" dataKey="revenue" stroke="#2E7D32" fill="#E8F5E9" />
  <Area type="monotone" dataKey="expenses" stroke="#D32F2F" fill="#FFEBEE" />
</AreaChart>

// Bar Chart (Orders Timeline)
<BarChart data={orderData}>
  <Bar dataKey="count" fill="#FBC02D" />
</BarChart>

// Pie Chart (Order Status)
<PieChart>
  <Pie dataKey="value" data={statusData} />
</PieChart>
```

#### Framer Motion Animations
```jsx
import { motion } from 'framer-motion';

// Page Transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>

// Hover Scale
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Interactive Card
</motion.div>
```

#### Lucide React Icons
```jsx
import { TrendingUp, Zap, MapPin, DollarSign } from 'lucide-react';

<TrendingUp className="w-6 h-6 text-green-600" />
<Zap className="w-4 h-4 text-yellow-500" />
<MapPin className="w-5 h-5 text-red-500" />
```

---

## Data Flow & Workflows

### 1. Dashboard Stats Loading Workflow

```
User visits /dashboard/farmer
        ↓
[FarmerLayout checks role]
        ↓
[Dashboard Page mounts]
        ↓
useAuth() retrieves user.id
        ↓
useEffect(() => {
  fetch('/api/dashboard/stats?farmerId=X')
})
        ↓
Backend queries MongoDB:
├─ CROPS: countDocuments({farmerId})
├─ ORDERS: find({farmerId}).toArray()
└─ EXPENSES: find({farmerId}).toArray()
        ↓
Backend aggregates:
├─ totalCrops
├─ totalOrders
├─ totalExpenses (sum)
├─ profit (revenue - expenses)
├─ monthlyData (12 months)
├─ orderDistribution
└─ activityTimeline
        ↓
Response returned to frontend
        ↓
useState updates:
[stats, monthlyData, orderDist, activity, recentOrders]
        ↓
Components rerender with new data
        ↓
Charts update with animations
        ↓
Page fully loaded ✅
```

---

### 2. Add Product Workflow

```
Farmer clicks "Add Product"
        ↓
[Navigate to /dashboard/farmer/add-product]
        ↓
Form component renders with fields:
├─ Title, Category, Grade
├─ Price, Quantity, Unit
├─ Description
├─ Images (drag-drop upload)
└─ Additional info
        ↓
Farmer fills form & selects images
        ↓
Images uploaded to browser (preview)
        ↓
Farmer clicks "Submit"
        ↓
[Form validation]:
├─ Title not empty ✓
├─ Category selected ✓
├─ Price > 0 ✓
├─ Quantity > 0 ✓
└─ Description provided ✓
        ↓
POST /api/crops
{
  farmerId,
  title,
  category,
  grade,
  price,
  quantity,
  unit,
  description,
  images: [File],
  harvestDate,
  harvestLocation
}
        ↓
Backend processes:
├─ Save files to /public/uploads/crops/
├─ Create crop document in CROPS collection
├─ Return created crop object
└─ Set status = "active"
        ↓
Frontend response handling:
├─ Show success toast
├─ Store crop in state
├─ Reset form
└─ Redirect to /manage-products
        ↓
Crop now visible in marketplace ✅
```

---

### 3. Farm Planner Multi-Step Workflow

```
Farmer navigates to /dashboard/farmer/planner
        ↓
[Wizard component initializes]
stepNumber = 1
showRibbon = true
        ↓
┌─────────────────────────────────────┐
│ STEP 1: SELECT CROP & SEASON        │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Season Radio Buttons:           │ │
│ │ ○ Rabi (Oct-Mar)                │ │
│ │ ○ Kharif_1 (Apr-Jun)            │ │
│ │ ○ Kharif_2 (Jul-Sep)            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Selected Season → Filter crops      │
│  [Rice] [Wheat] [Corn] [Cotton]     │
│                                     │
│ Farmer selects [Rice]               │
│                                     │
│ [Previous] [Next →]                 │
└─────────────────────────────────────┘
        ↓
Store in state: selectedCrops = ['Rice']
        ↓
┌─────────────────────────────────────┐
│ STEP 2: LOCATION SELECTION          │
├─────────────────────────────────────┤
│ Division: [Select ▼] → Dhaka        │
│ District: [Select ▼] → Dhaka/Farid  │
│ Upazila: [Select ▼] → Mirpur/Gulshan│
│                                     │
│ Soil Type: [Select ▼] → Loam        │
│ Soil pH: [Slider] → 6.5             │
│                                     │
│ [← Previous] [Next →]               │
└─────────────────────────────────────┘
        ↓
Store in state: location = {
  division: 'Dhaka',
  district: 'Dhaka',
  upazila: 'Mirpur',
  soilType: 'Loam',
  soilPH: 6.5
}
        ↓
┌─────────────────────────────────────┐
│ STEP 3: LAND DETAILS                │
├─────────────────────────────────────┤
│ Land Area: [Input] hectares → 5     │
│ Elevation: [Input] meters → 25      │
│ Water Source: [Select ▼] → Well     │
│ Slope: [Select ▼] → Gentle          │
│                                     │
│ Equipment Checklist:                │
│ ☑ Tiller    ☑ Sprayer              │
│ ☐ Thresher  ☐ Plow                 │
│                                     │
│ [← Previous] [Generate Plan]        │
└─────────────────────────────────────┘
        ↓
Store in state: landDetails = {
  areaHectares: 5,
  elevation: 25,
  waterSource: 'Well',
  slope: 'Gentle',
  equipment: ['tiller', 'sprayer']
}
        ↓
POST /api/planner
{
  farmerId,
  cropIds: ['rice_id'],
  location: { ... },
  landDetails: { ... },
  plannedStartDate: '2026-04-01',
  plannedEndDate: '2026-07-31'
}
        ↓
Backend:
├─ Validate all fields
├─ Calculate water requirement
├─ Estimate yield based on crop+location
├─ Create FARM_PLANS document
└─ Return plan with summary
        ↓
┌─────────────────────────────────────┐
│ FINAL PLAN SUMMARY                  │
├─────────────────────────────────────┤
│ 🌾 Crop: Rice (Basmati)             │
│ 📍 Location: Dhaka Division         │
│ 📐 Land Area: 5 hectares            │
│ 💧 Water: 5000 m³ (from Well)       │
│ 📅 Period: Apr 1 - Jul 31, 2026     │
│ 🎯 Est. Yield: 25 tons              │
│ 💰 Est. Revenue: 5 lac TK           │
│                                     │
│ [Calendar View] [Download PDF]      │
└─────────────────────────────────────┘
        ↓
Farmer clicks [Download PDF]
        ↓
usePlanDownload() generates PDF:
├─ Plan summary
├─ Calendar visualization
├─ Resource requirements
├─ Weather data
└─ Contact info
        ↓
PDF downloaded to device ✅
```

---

## Security & Role Management

### Role-Based Access Control (RBAC)

**User Roles**:
```javascript
const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
  STUDENT: 'student'
};

const ROLE_HIERARCHY = {
  ADMIN: 4,
  FARMER: 3,
  BUYER: 2,
  STUDENT: 1
};
```

**Role Permissions**:

| Action | Farmer | Buyer | Admin | Student |
|--------|--------|-------|-------|---------|
| View Dashboard | ✅ | ✅ | ✅ | ❌ |
| Add Crop | ✅ | ❌ | ✅ | ❌ |
| Buy Crop | ❌ | ✅ | ✅ | ❌ |
| View Weather | ✅ | ✅ | ✅ | ✅ |
| Message | ✅ | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ✅ | ❌ |

---

### Frontend Access Control

**RoleRoute Component**:
```jsx
import { RoleRoute } from '@/components/auth/RoleRoute';

export default function FarmerDashboard() {
  return (
    <RoleRoute requiredRole="farmer">
      <DashboardContent />
    </RoleRoute>
  );
}

// RoleRoute will:
// 1. Check if user is authenticated
// 2. Verify user.role === 'farmer'
// 3. Redirect to /403 if access denied
// 4. Show loading spinner while checking
```

**Layout-Level Protection**:
```jsx
// src/app/(dashboard)/farmer/layout.jsx
export default function FarmerLayout({ children }) {
  const router = useRouter();
  const { isFarmer, loading } = useRole();

  useEffect(() => {
    if (!loading && !isFarmer) {
      router.push('/403'); // Access Denied
    }
  }, [loading, isFarmer, router]);

  if (loading) return <LoadingPage />;
  if (!isFarmer) return null;

  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}
```

---

### Backend API Security

**JWT Token Validation**:
```javascript
// src/lib/auth/middleware.js
import { verify } from 'jsonwebtoken';

export const withAuth = (handler) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user to request

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  };
};
```

**Farmer-Only Endpoint Protection**:
```javascript
// Check that logged-in farmer can only access their own data
export const GET = withAuth(async (req, res) => {
  const lookedUpFarmerId = req.query.farmerId;
  const loggedInFarmerId = req.user._id;

  if (lookedUpFarmerId !== loggedInFarmerId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied - can only view your own data'
    });
  }

  // Proceed with data fetching...
});
```

---

## Usage Guide

### How to Add a New Feature to Farmer Dashboard

#### Example: Adding a "Soil Analysis" Page

**Step 1: Create the Page Component**
```jsx
// src/app/(dashboard)/farmer/soil-analysis/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import toast from 'react-hot-toast';

export default function SoilAnalysisPage() {
  const { user } = useAuth();
  const { isFarmer } = useRole();
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFarmer) return;

    const fetchSoilData = async () => {
      try {
        const res = await fetch(
          `/api/soil-analysis?farmerId=${user._id}`
        );
        const { data } = await res.json();
        setSoilData(data);
      } catch (error) {
        toast.error('Failed to fetch soil data');
      } finally {
        setLoading(false);
      }
    };

    fetchSoilData();
  }, [user, isFarmer]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Soil Analysis</h1>
      {/* Render soil data */}
    </div>
  );
}
```

**Step 2: Create Backend API Endpoint**
```javascript
// src/app/api/soil-analysis/route.js
import { getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (req, res) => {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');

    const collection = getCollection('soil_analysis');
    const data = await collection
      .find({ farmerId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Soil analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch soil analysis'
    });
  }
});
```

**Step 3: Add Navigation Link**
```jsx
// src/components/farmer/sidebar.jsx
// Add to navigation menu:
<Link href="/dashboard/farmer/soil-analysis">
  <PiTestTubeFill /> Soil Analysis
</Link>
```

---

### How to Query the API from Frontend

```javascript
// Example: Fetch farmer's crops
const response = await fetch(
  '/api/crops?farmerId=user123&category=Rice&limit=10'
);
const { success, data, message } = await response.json();

if (success) {
  console.log('Crops:', data.crops);
  console.log('Total:', data.pagination.totalCrops);
} else {
  console.error('Error:', message);
}
```

```javascript
// Example: Add new expense
const response = await fetch('/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    farmerId: 'user123',
    cropId: 'crop456',
    category: 'seeds',
    description: 'Rice seeds',
    amount: 5000,
    date: new Date()
  })
});

const { success, data } = await response.json();
```

---

## Development & Maintenance

### Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
MONGODB_URI=mongodb://localhost:27017/smart-agriculture
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Third-party APIs
OPENWEATHER_API_KEY=xxx
GOOGLE_MAPS_API_KEY=xxx
STRIPE_PUBLIC_KEY=xxx
STRIPE_SECRET_KEY=xxx
```

---

### Key Files for Maintenance

| File | Purpose | Modification Frequency |
|------|---------|------------------------|
| `src/app/api/dashboard/stats/route.js` | Core dashboard logic | Monthly |
| `src/components/farmer/` | UI components | Weekly |
| `src/hooks/` | Data fetching hooks | Weekly |
| `src/lib/db/collections.js` | Database schema | Quarterly |
| `src/contexts/AuthProvider.jsx` | Authentication | Quarterly |

---

### Testing Checklist

Before deploying farmer dashboard changes:

- [ ] Dashboard stats calculate correctly
- [ ] All roles have correct access
- [ ] Images upload properly
- [ ] Messages send and display
- [ ] Farm plan PDF downloads
- [ ] Expense tracking accurate
- [ ] Weather data updates
- [ ] Mobile responsive design works
- [ ] Error messages display appropriately
- [ ] Load times acceptable (< 3 seconds)

---

### Common Issues & Solutions

**Issue**: Dashboard stats not updating
**Solution**: 
- Check farmerId is correctly passed
- Verify MongoDB connection
- Clear browser cache
- Check browser console for errors

**Issue**: Image upload fails
**Solution**:
- Verify `/public/uploads/` directory exists
- Check file size (< 5MB)
- Ensure image format is JPG/PNG/WebP
- Check file permissions

**Issue**: Messages not sending
**Solution**:
- Verify both users exist
- Check conversation ID is valid
- Ensure JWT token is valid
- Check MongoDB messages collection

---

## Conclusion

The Farmer Dashboard is a comprehensive, production-ready system for agricultural management. It provides farmers with essential tools for:

1. 📊 **Monitoring** farm performance through analytics
2. 🌾 **Managing** crops and marketplace listings
3. 💰 **Tracking** expenses and profitability
4. 🌍 **Planning** farm operations with seasonal data
5. 💬 **Communicating** with buyers and other farmers
6. 🌡️ **Accessing** real-time weather and disease alerts

All components are properly secured, role-protected, and optimized for performance. The modular architecture makes it easy to add new features and maintain existing functionality.

---

**For questions or issues**: Please refer to the main project README or contact the development team.

---

**Version History**:
- v1.0 (March 2026) - Initial release with all core features

---
