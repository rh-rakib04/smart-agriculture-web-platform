# Farmer Dashboard - API Reference & Architecture

**Last Updated**: March 2026  
**Document Type**: Technical Reference

---

## Quick Navigation

- [API Endpoint Summary](#api-endpoint-summary)
- [Architecture Diagrams](#architecture-diagrams)
- [Database Relationships](#database-relationships)
- [Component Tree](#component-tree)
- [Data Types & Interfaces](#data-types--interfaces)

---

## API Endpoint Summary

### Overview Table

| HTTP Method | Endpoint | Purpose | Auth Required | Role |
|-------------|----------|---------|---------------|------|
| **GET** | `/api/dashboard/stats` | Dashboard analytics | ✅ | Farmer |
| **GET** | `/api/crops` | List crops | ❌ | Any |
| **POST** | `/api/crops` | Create crop | ✅ | Farmer |
| **PUT** | `/api/crops/{id}` | Update crop | ✅ | Farmer |
| **DELETE** | `/api/crops/{id}` | Delete crop | ✅ | Farmer |
| **GET** | `/api/crops/{id}` | Get crop details | ❌ | Any |
| **GET** | `/api/expenses` | List expenses | ✅ | Farmer |
| **POST** | `/api/expenses` | Create expense | ✅ | Farmer |
| **PUT** | `/api/expenses/{id}` | Update expense | ✅ | Farmer |
| **DELETE** | `/api/expenses/{id}` | Delete expense | ✅ | Farmer |
| **GET** | `/api/expenses/analytics` | Expense analytics | ✅ | Farmer |
| **GET** | `/api/messages` | List conversations | ✅ | Any |
| **POST** | `/api/messages` | Send message | ✅ | Any |
| **DELETE** | `/api/messages/{id}` | Delete message | ✅ | Any |
| **GET** | `/api/weather/current` | Current weather | ❌ | Any |
| **GET** | `/api/weather/forecast` | Weather forecast | ❌ | Any |
| **POST** | `/api/planner` | Save farm plan | ✅ | Farmer |
| **GET** | `/api/planner/{id}` | Get farm plans | ✅ | Farmer |
| **POST** | `/api/harvest/estimate` | Estimate yield | ✅ | Farmer |
| **GET** | `/api/news/latest` | Get farm news | ❌ | Any |

---

## Architecture Diagrams

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 SMART AGRICULTURE WEB PLATFORM                  │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Next.js)                         │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  User Interface (Pages & Components)                              │
│  ├─ Dashboard: Statistics, Charts, Activity                       │
│  ├─ Weather: Current, Forecast                                    │
│  ├─ Plant Disease: Detection Interface                            │
│  ├─ Farm Planner: 3-Step Wizard                                   │
│  ├─ Messages: Chat, Conversations                                 │
│  ├─ Crops: Add, Manage, Search                                    │
│  ├─ Expenses: Tracking, Analytics                                 │
│  └─ Calculator: Profit, ROI Analysis                              │
│                                                                    │
│  State Management                                                  │
│  ├─ React Context: Auth, Notifications, Theme                    │
│  ├─ Custom Hooks: useCrops, useExpenses, useMessages             │
│  └─ Local Storage: Token, User Preferences                        │
│                                                                    │
│  UI Libraries                                                      │
│  ├─ DaisyUI: Components, Layout                                   │
│  ├─ Framer Motion: Animations                                     │
│  ├─ Recharts: Visualizations                                      │
│  └─ Lucide React: Icons                                           │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST ↓
┌───────────────────────────────────────────────────────────────────┐
│                   API LAYER (Next.js Routes)                       │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Route Handlers (src/app/api/)                                    │
│  ├─ /dashboard/stats                                              │
│  ├─ /crops (CRUD)                                                 │
│  ├─ /expenses (CRUD, Analytics)                                   │
│  ├─ /messages (Send, Delete, Read)                               │
│  ├─ /weather (Current, Forecast)                                 │
│  ├─ /planner (Save, Retrieve)                                     │
│  ├─ /harvest (Estimate, Predict)                                 │
│  └─ /news (Latest)                                                │
│                                                                    │
│  Middleware                                                        │
│  ├─ Authentication (JWT Validation)                               │
│  ├─ Authorization (Role Checking)                                 │
│  ├─ Validation (Data Sanitization)                                │
│  └─ Error Handling (Try-Catch)                                    │
│                                                                    │
│  Services (src/lib/)                                              │
│  ├─ Database Operations                                            │
│  ├─ Business Logic                                                │
│  ├─ Third-party API Calls                                         │
│  └─ File Upload Handling                                          │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
                            ↓ MongoDB Protocol ↓
┌───────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Collections                                                       │
│  ├─ users          - User profiles by role                        │
│  ├─ crops          - Crop listings from farmers                   │
│  ├─ orders         - Purchase orders & transactions               │
│  ├─ expenses       - Farm expense tracking                        │
│  ├─ messages       - Direct messages between users                │
│  ├─ farm_plans     - Saved planning sessions                      │
│  ├─ harvest_data   - Actual harvest results                       │
│  └─ predictions    - ML model predictions                         │
│                                                                    │
│  Indexes (for performance)                                        │
│  ├─ farmerId (fastest crop lookup)                                │
│  ├─ status (order filtering)                                      │
│  ├─ category (crop categorization)                                │
│  └─ createdAt (timeline queries)                                  │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

### Data Flow Diagram

```
1. USER AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════════

  [User visits /login]
         ↓
  [Enter credentials]
         ↓
  [POST /api/auth/login]
         ↓
  Backend: Verify credentials against users collection
         ↓
  Generate JWT Token
         ↓
  [Return token + user data]
         ↓
  Frontend: Store token in localStorage
         ↓
  Set AuthContext state
         ↓
  [Redirect to /dashboard/farmer] ✅


2. DASHBOARD LOAD FLOW
═══════════════════════════════════════════════════════════════════

  [User navigates to /dashboard/farmer]
         ↓
  [FarmerLayout checks useRole()]
         ↓
  Is user a farmer? ← No → [Redirect to /403]
         ↓ Yes
  [Dashboard page mounts]
         ↓
  useAuth() retrieves user._id
         ↓
  useEffect runs 3 parallel fetches:
  ├─ GET /api/dashboard/stats?farmerId=X
  ├─ GET /api/crops?farmerId=X
  └─ GET /api/expenses?farmerId=X
         ↓
  All 3 backends query MongoDB async:
  ├─ Collection('crops').countDocuments({farmerId})
  ├─ Collection('orders').find({farmerId}).toArray()
  └─ Collection('expenses').find({farmerId}).sum(amount)
         ↓
  3 responses returned via Promise.all()
         ↓
  useState updates: [stats, crops, expenses]
         ↓
  Components rerender:
  ├─ StatCards (with CountUp animation)
  ├─ Charts (AreaChart, BarChart, PieChart)
  ├─ Activity Timeline
  └─ Recent Orders Table
         ↓
  [Page fully loaded] ✅


3. ADD CROP LISTING FLOW
═══════════════════════════════════════════════════════════════════

  [Farmer clicks "Add Product"]
         ↓
  [Navigate to /dashboard/farmer/add-product]
         ↓
  [Form component renders]
         ↓
  Farmer fills form + selects images
         ↓
  Images converted to base64 for preview
         ↓
  [Farmer clicks "Submit"]
         ↓
  Client-side validation:
  ├─ Title not empty?
  ├─ Category selected?
  ├─ Price > 0?
  ├─ Quantity > 0?
  └─ Description filled?
         ↓
  All valid? → No → [Show validation error]
         ↓ Yes
  POST /api/crops
  {
    farmerId,
    title,
    category,
    price,
    quantity,
    description,
    images: [File],
    ...
  }
         ↓
  Backend processes:
  ├─ Receive multipart/form-data
  ├─ Save images to /public/uploads/crops/
  ├─ Create document in crops collection
  ├─ Set status = "active"
  └─ Return new crop object
         ↓
  Frontend receives response
         ↓
  Is success? → No → [Toast error]
         ↓ Yes
  ├─ Show success toast
  ├─ Add to crops state
  ├─ Reset form
  └─ Redirect to /manage-products
         ↓
  [Crop now live in marketplace] ✅


4. MESSAGE SEND FLOW
═══════════════════════════════════════════════════════════════════

  [User types message in chat]
         ↓
  [Clicks "Send"]
         ↓
  Client validation:
  ├─ Message not empty?
  ├─ Recipient ID exists?
  └─ Conversation ID valid?
         ↓
  POST /api/messages
  {
    senderId,
    recipientId,
    conversationId,
    content,
    timestamp
  }
         ↓
  Backend:
  ├─ Validate sender has JWT token
  ├─ Check recipient exists
  ├─ Create message document in messages collection
  ├─ Update conversation's lastMessage
  └─ Return message object
         ↓
  Frontend:
  ├─ Optimistically add message to UI
  ├─ Disable send button
         ↓
  Response arrives
         ↓
  ├─ Update message with _id from server
  ├─ Mark as sent
  ├─ Re-enable send button
  └─ Clear input
         ↓
  [Message displayed in chat] ✅


5. EXPENSE TRACKING FLOW
═══════════════════════════════════════════════════════════════════

  [Farmer logs new expense]
         ↓
  [Form: category, amount, date, notes]
         ↓
  [Submit]
         ↓
  Validation:
  ├─ Category selected?
  ├─ Amount > 0?
  └─ Date valid?
         ↓
  POST /api/expenses
  {
    farmerId,
    cropId,
    category: "seeds" | "fertilizer" | "labor" | "equipment",
    amount,
    date,
    notes
  }
         ↓
  Backend:
  ├─ Save to expenses collection
  ├─ Index by (farmerId, date)
  └─ Return confirmation
         ↓
  Frontend:
  ├─ Toast success
  ├─ Fetch updated analytics
         ↓
  GET /api/expenses/analytics?farmerId=X
         ↓
  Backend aggregates:
  ├─ Sum all expenses
  ├─ Group by category
  ├─ Calculate monthly averages
  └─ Return summary
         ↓
  Charts update:
  ├─ Pie chart (category breakdown)
  ├─ Bar chart (monthly trends)
  ├─ Total amount card
         ↓
  [Dashboard updated] ✅
```

---

## Database Relationships

### ER Diagram (Entity-Relationship)

```
┌─────────────┐
│    USERS    │
├─────────────┤
│ _id         │
│ email       │
│ firstName   │
│ lastName    │
│ role        │
│ avatar      │
│ phone       │
│ farmName    │
│ totalLand   │
│ location    │
│ createdAt   │
└──────┬──────┘
       │
       │ 1------ (Farmer user.role='farmer')
       │
       ├─────────────────────┬──────────────────────┬──────────────────┐
       │                     │                      │                  │
       ↓                     ↓                      ↓                  ↓
  ┌─────────┐         ┌──────────┐         ┌──────────┐      ┌──────────────┐
  │  CROPS  │         │ EXPENSES │         │ MESSAGES │      │  FARM_PLANS  │
  ├─────────┤         ├──────────┤         ├──────────┤      ├──────────────┤
  │ _id     │         │ _id      │         │ _id      │      │ _id          │
  │farmerId │         │farmerId  │         │senderId  │      │farmerId      │
  │ title   │─────┐   │category  │         │recipientId│     │cropIds[]     │
  │category │     │   │amount    │         │content   │      │location      │
  │ price   │     │   │ date     │         │timestamp │      │landDetails   │
  │quantity │     │   │cropId    │         │read      │      │startDate     │
  │ status  │     │   │ notes    │         │conv_id   │      │endDate       │
  │ images  │     │   │createdAt │         │createdAt │      │createdAt     │
  │createdAt│     │   └──────────┘         └──────────┘      └──────────────┘
  └─────────┘     │
                  └─(optional) Crop FK
                         
                  
  ┌──────────┐
  │  ORDERS  │
  ├──────────┤
  │ _id      │
  │farmerId  │──────── (Seller, references USERS)
  │buyerId   │──────── (Buyer, references USERS)
  │cropId    │──────── (references CROPS)
  │quantity  │
  │totalPrice│
  │ status   │
  │createdAt │
  │updatedAt │
  └──────────┘


RELATIONSHIPS SUMMARY:
═════════════════════════════════════════════════════════════════

users (1) ←→ (∞) crops
  └─ Each farmer can list multiple crops

users (1) ←→ (∞) expenses
  └─ Each farmer records multiple expenses

users (1) ←→ (∞) messages
  └─ Each user can send/receive many messages

users (1) ←→ (∞) orders (as farmer)
  └─ Each farmer receives multiple orders

users (1) ←→ (∞) orders (as buyer)
  └─ Each buyer places multiple orders

users (1) ←→ (∞) farm_plans
  └─ Each farmer creates multiple plans

crops (1) ←→ (∞) expenses
  └─ Each crop may have related expenses

crops (1) ←→ (∞) orders
  └─ Each crop can be ordered multiple times
```

---

## Component Tree

### Farmer Dashboard Component Hierarchy

```
<FarmerLayout>
│
├─ <RoleRoute requiredRole="farmer">
│  │
│  ├─ <DashboardWrapper>
│  │  │
│  │  ├─ <Header>
│  │  │  ├─ Logo
│  │  │  ├─ SearchBar
│  │  │  └─ NotificationBell
│  │  │     └─ NotificationDropdown
│  │  │
│  │  └─ <MainContent>
│  │
│  └─ <Switch>
│     │
│     ├─ <Route path="/dashboard/farmer">
│     │  └─ <DashboardPage>
│     │     ├─ <StatCard /> × 4
│     │     ├─ <Charts>
│     │     │  ├─ <AreaChart> (Revenue vs Expenses)
│     │     │  ├─ <BarChart> (Orders Timeline)
│     │     │  └─ <PieChart> (Order Status)
│     │     └─ <ActivityTimeline>
│     │
│     ├─ <Route path="/dashboard/farmer/weather">
│     │  └─ <WeatherPage>
│     │     ├─ <LocationSelector>
│     │     ├─ <CurrentWeatherCard>
│     │     ├─ <ForecastCards> × 7
│     │     └─ <FarmingAlerts>
│     │
│     ├─ <Route path="/dashboard/farmer/plantDisease">
│     │  └─ <PlantDiseasePage>
│     │     ├─ <CropTypeSelector>
│     │     │  └─ Crop buttons (20+)
│     │     ├─ <ImageUploadZone>
│     │     │  ├─ Input[type=file]
│     │     │  └─ DragDrop area
│     │     └─ <DetectionResults>
│     │        ├─ Disease name
│     │        ├─ Confidence score
│     │        └─ Treatment recommendations
│     │
│     ├─ <Route path="/dashboard/farmer/planner">
│     │  └─ <PlannerPage>
│     │     ├─ <StepIndicator>
│     │     ├─ <Step 1>
│     │     │  └─ <CropSelector>
│     │     │     ├─ Season radio buttons
│     │     │     └─ Crop cards (filtered)
│     │     ├─ <Step 2>
│     │     │  └─ <LocationSelector>
│     │     │     ├─ Division dropdown
│     │     │     ├─ District dropdown
│     │     │     └─ Upazila dropdown
│     │     ├─ <Step 3>
│     │     │  └─ <LandDetailsForm>
│     │     │     ├─ Area input
│     │     │     ├─ Water source select
│     │     │     └─ Equipment checklist
│     │     └─ <PlanResult>
│     │        ├─ <PlanSummary>
│     │        ├─ <Calendar>
│     │        └─ <DownloadButton>
│     │
│     ├─ <Route path="/dashboard/farmer/messages">
│     │  └─ <MessagesPage>
│     │     ├─ <ConversationList>
│     │     │  ├─ SearchBar
│     │     │  └─ ConversationItem × n
│     │     │     ├─ Avatar
│     │     │     ├─ Name
│     │     │     └─ Last message preview
│     │     └─ <ChatWindow>
│     │        ├─ <ChatHeader>
│     │        ├─ <MessageList>
│     │        │  └─ Message × n
│     │        │     ├─ Avatar
│     │        │     ├─ Content
│     │        │     └─ Timestamp
│     │        └─ <MessageInput>
│     │           ├─ Textarea
│     │           └─ SendButton
│     │
│     ├─ <Route path="/dashboard/farmer/add-product">
│     │  └─ <AddProductPage>
│     │     └─ <ProductForm>
│     │        ├─ TextInput (title)
│     │        ├─ Select (category)
│     │        ├─ TextInput (price)
│     │        ├─ TextInput (quantity)
│     │        ├─ ImageUploader
│     │        │  └─ Multiple file inputs
│     │        ├─ Textarea (description)
│     │        └─ SubmitButton
│     │
│     ├─ <Route path="/dashboard/farmer/manage-products">
│     │  └─ <ManageProductsPage>
│     │     ├─ SearchBar
│     │     ├─ FilterBar (status, category)
│     │     └─ <ProductTable>
│     │        ├─ TableHeader
│     │        └─ ProductRow × n
│     │           ├─ Image thumbnail
│     │           ├─ Name
│     │           ├─ Price
│     │           ├─ Quantity
│     │           ├─ EditButton
│     │           └─ DeleteButton
│     │
│     └─ <Route path="/dashboard/farmer/calculator">
│        └─ <CalculatorPage>
│           ├─ <IncomeSection>
│           │  ├─ CropSelect
│           │  ├─ QuantityInput
│           │  └─ PriceInput
│           ├─ <ExpenseSection>
│           │  ├─ CategorySelect
│           │  └─ AmountInput
│           └─ <ResultsSection>
│              ├─ Total revenue
│              ├─ Total expenses
│              ├─ Net profit
│              └─ Profit margin %
│
└─ <Footer>
   ├─ QuickLinks
   ├─ Services
   ├─ ContactInfo
   └─ SocialLinks
```

---

## Data Types & Interfaces

### TypeScript Interfaces (Recommended Implementation)

#### User Type
```typescript
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'farmer' | 'buyer' | 'admin' | 'student';
  phone: string;
  avatar?: string;
  
  // Farmer-specific
  farmName?: string;
  totalLand?: number;
  location?: {
    division: string;
    district: string;
    upazila: string;
    address: string;
  };
  
  // Account
  bankAccount?: string;
  mobileWallet?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'suspended';
}
```

#### Crop Type
```typescript
interface Crop {
  _id: string;
  farmerId: string;
  farmerName: string;
  
  // Basic Info
  title: string;
  category: string;
  subCategory?: string;
  grade: 'A' | 'B' | 'C';
  description: string;
  
  // Pricing & Quantity
  price: number;
  quantity: number;
  unit: string;
  
  // Media
  images: string[];
  
  // Details
  harvestDate: Date;
  harvestLocation: string;
  status: 'active' | 'draft' | 'sold' | 'archived';
  
  // Optional
  certifications?: string[];
  minOrderQuantity?: number;
  storage?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

#### Expense Type
```typescript
interface Expense {
  _id: string;
  farmerId: string;
  cropId?: string;
  cropName?: string;
  
  // Details
  category: 'seeds' | 'fertilizer' | 'labor' | 'equipment' | 'water' | 'electricity' | 'other';
  description: string;
  amount: number;
  date: Date;
  
  // Optional
  paymentMethod?: 'cash' | 'check' | 'bank_transfer' | 'mobile_banking';
  receipt?: string;
  vendor?: string;
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

#### Order Type
```typescript
interface Order {
  _id: string;
  
  // Parties
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  
  // Product
  cropId: string;
  cropName: string;
  
  // Quantity & Price
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  
  // Status
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  
  // Delivery
  deliveryDate?: Date;
  deliveryLocation?: string;
  
  // Optional
  paymentMethod?: string;
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

#### Message Type
```typescript
interface Message {
  _id: string;
  conversationId: string;
  participants: string[];
  
  // Content
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  
  // Status
  read: boolean;
  readAt?: Date;
  
  // Optional
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

#### FarmPlan Type
```typescript
interface FarmPlan {
  _id: string;
  farmerId: string;
  cropIds: string[];
  cropNames: string[];
  
  // Location
  location: {
    division: string;
    district: string;
    upazila: string;
    soilType: string;
    soilPH: number;
    elevation: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Land Details
  landDetails: {
    areaHectares: number;
    areaOtherUnit?: number;
    otherUnitType?: string;
    waterSource: string;
    slope: string;
    soilCondition?: string;
    isPrepped?: boolean;
  };
  
  // Dates
  plannedStartDate: Date;
  plannedEndDate: Date;
  completedAt?: Date;
  
  // Estimates
  estimatedYield?: number;
  estimatedRevenue?: number;
  waterRequirement?: number;
  laborDays?: number;
  
  // Optional
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

---

### API Response Types

#### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

#### Error Response
```typescript
interface ApiError {
  success: false;
  error: string;
  statusCode: number;
  details?: Record<string, any>;
}
```

#### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasMore: boolean;
  };
}
```

---

### Query Parameters

#### Dashboard Stats Query
```typescript
interface DashboardStatsQuery {
  farmerId: string;  // Required
  dateRange?: 'week' | 'month' | 'year' | 'all';
}
```

#### Crops Query
```typescript
interface CropsQuery {
  farmerId?: string;
  search?: string;
  category?: string;
  status?: 'active' | 'draft' | 'sold';
  minPrice?: number;
  maxPrice?: number;
  page?: number;  // Default: 1
  limit?: number; // Default: 20
}
```

#### Expenses Query
```typescript
interface ExpensesQuery {
  farmerId: string;  // Required
  cropId?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;  // Default: 1
  limit?: number; // Default: 50
}
```

#### Messages Query
```typescript
interface MessagesQuery {
  userId: string;   // Required
  conversationId?: string;
  limit?: number;   // Default: 50
  offset?: number;  // Default: 0
}
```

---

## Common Response Examples

### Dashboard Stats Response
```json
{
  "success": true,
  "data": {
    "totalCrops": 15,
    "totalOrders": 128,
    "totalExpenses": 450000,
    "calculatedProfit": 1200000,
    "monthlyData": [
      {
        "month": "January",
        "revenue": 500000,
        "expenses": 150000
      }
    ],
    "orderDistribution": {
      "pending": 10,
      "approved": 45,
      "completed": 68,
      "rejected": 5
    },
    "activityTimeline": [
      {
        "date": "2026-03-25T10:30:00Z",
        "action": "Order received",
        "details": "Rice 50kg"
      }
    ],
    "recentOrders": [
      {
        "_id": "order_123",
        "cropName": "Basmati Rice",
        "quantity": 50,
        "totalPrice": 2500000,
        "status": "pending"
      }
    ]
  }
}
```

### Crops List Response
```json
{
  "success": true,
  "data": {
    "crops": [
      {
        "_id": "crop_123",
        "farmerId": "farmer_456",
        "title": "Basmati Rice",
        "category": "Rice",
        "price": 50000,
        "quantity": 500,
        "unit": "kg",
        "images": ["url1", "url2"],
        "status": "active",
        "createdAt": "2026-03-20T08:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCrops": 95,
      "limit": 20
    }
  }
}
```

---

## Performance Optimization Notes

### Database Indexes
```javascript
// Critical indexes for fast queries
db.crops.createIndex({ farmerId: 1 });
db.crops.createIndex({ status: 1, createdAt: -1 });
db.crops.createIndex({ category: 1 });
db.expenses.createIndex({ farmerId: 1, date: -1 });
db.orders.createIndex({ farmerId: 1, status: 1 });
db.messages.createIndex({ conversationId: 1, createdAt: -1 });
```

### Frontend Caching Strategy
```javascript
// Cache dashboard stats for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

const { data, error } = useSWR(
  `/api/dashboard/stats?farmerId=${farmerId}`,
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: CACHE_DURATION,
    focusThrottleInterval: CACHE_DURATION
  }
);
```

---

### API Rate Limiting (Recommended)
```javascript
// Implement rate limiting per user
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  keyGenerator: (req) => req.user._id
});

app.use('/api/crops', limiter);
```

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB indexes created
- [ ] JWT secret changed from default
- [ ] CORS configured properly
- [ ] File upload path secured
- [ ] HTTPS enabled
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Database backups scheduled
- [ ] CDN configured for images
- [ ] API documentation deployed
- [ ] Load testing completed

---

**For detailed implementation steps, refer to FARMER_DASHBOARD_DOCUMENTATION.md**

---
