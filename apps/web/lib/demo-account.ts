export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  unread: boolean;
}

export const demoNotifications: DemoNotification[] = [
  {
    id: "notification-1",
    title: "Your flowers are on the way",
    body: "Your order MK-1024 is out for delivery. Our rider will contact the recipient shortly.",
    date: "Today",
    unread: true,
  },
  {
    id: "notification-2",
    title: "Delivery completed",
    body: "Your order MK-1021 was delivered successfully.",
    date: "2 days ago",
    unread: true,
  },
  {
    id: "notification-3",
    title: "Birthday reminder",
    body: "Sarah's birthday is coming up in 7 days. Find something beautiful to send.",
    date: "3 days ago",
    unread: false,
  },
  {
    id: "notification-4",
    title: "Payment received",
    body: "We've received your payment for order MK-1021.",
    date: "5 days ago",
    unread: false,
  },
];

export interface DemoPayment {
  id: string;
  date: string;
  order: string;
  method: string;
  reference: string;
  amount: number;
  status: "Paid" | "Failed" | "Pending";
}

export const demoPayments: DemoPayment[] = [
  {
    id: "payment-1",
    date: "28 Sep 2026",
    order: "MK-1024",
    method: "M-Pesa",
    reference: "QWE7R8T9Y0",
    amount: 4850,
    status: "Paid",
  },
  {
    id: "payment-2",
    date: "25 Sep 2026",
    order: "MK-1021",
    method: "M-Pesa",
    reference: "ABC4D5E6F7",
    amount: 3200,
    status: "Paid",
  },
  {
    id: "payment-3",
    date: "18 Sep 2026",
    order: "MK-1017",
    method: "Card",
    reference: "TXN-847291",
    amount: 5750,
    status: "Paid",
  },
  {
    id: "payment-4",
    date: "10 Sep 2026",
    order: "MK-1012",
    method: "M-Pesa",
    reference: "JKL1M2N3P4",
    amount: 2800,
    status: "Paid",
  },
];

export interface DemoCampaign {
  id: string;
  name: string;
  channel: string;
  audience: string;
  starts: string;
  ends: string;
  status: "Draft" | "Scheduled" | "Active" | "Completed";
  sent: number;
}

export const demoCampaigns: DemoCampaign[] = [
  {
    id: "campaign-1",
    name: "Birthday Flowers",
    channel: "Email",
    audience: "Customers with upcoming birthdays",
    starts: "01 Oct 2026",
    ends: "07 Oct 2026",
    status: "Scheduled",
    sent: 0,
  },
  {
    id: "campaign-2",
    name: "Weekend Blooms",
    channel: "Email",
    audience: "All customers",
    starts: "26 Sep 2026",
    ends: "28 Sep 2026",
    status: "Completed",
    sent: 1240,
  },
  {
    id: "campaign-3",
    name: "Anniversary Gifting",
    channel: "SMS",
    audience: "Customers with upcoming anniversaries",
    starts: "29 Sep 2026",
    ends: "05 Oct 2026",
    status: "Active",
    sent: 386,
  },
  {
    id: "campaign-4",
    name: "New Customer Welcome",
    channel: "Email",
    audience: "New customers",
    starts: "01 Sep 2026",
    ends: "31 Dec 2026",
    status: "Active",
    sent: 892,
  },
  {
    id: "campaign-5",
    name: "Mother's Day Preview",
    channel: "Email",
    audience: "Engaged customers",
    starts: "15 Aug 2026",
    ends: "20 Aug 2026",
    status: "Draft",
    sent: 0,
  },
];

export interface DemoPromotion {
  id: string;
  code: string;
  type: "Percentage" | "Fixed amount" | "Free delivery";
  scope: string;
  starts: string;
  ends: string;
  status: "Active" | "Scheduled" | "Expired" | "Draft";
  used: number;
}

export const demoPromotions: DemoPromotion[] = [
  {
    id: "promotion-1",
    code: "FLOWERS10",
    type: "Percentage",
    scope: "All flowers",
    starts: "25 Sep 2026",
    ends: "05 Oct 2026",
    status: "Active",
    used: 48,
  },
  {
    id: "promotion-2",
    code: "WELCOME500",
    type: "Fixed amount",
    scope: "First-time customers",
    starts: "01 Sep 2026",
    ends: "30 Sep 2026",
    status: "Expired",
    used: 126,
  },
  {
    id: "promotion-3",
    code: "FREESHIP",
    type: "Free delivery",
    scope: "Orders over KES 3,500",
    starts: "01 Oct 2026",
    ends: "07 Oct 2026",
    status: "Scheduled",
    used: 0,
  },
  {
    id: "promotion-4",
    code: "BLOOM15",
    type: "Percentage",
    scope: "Selected bouquets",
    starts: "15 Sep 2026",
    ends: "15 Oct 2026",
    status: "Active",
    used: 37,
  },
  {
    id: "promotion-5",
    code: "GIFT1000",
    type: "Fixed amount",
    scope: "Gift packages",
    starts: "01 Nov 2026",
    ends: "30 Nov 2026",
    status: "Draft",
    used: 0,
  },
];

export interface DemoOrder {
  id: string;
  order: string;
  customer: string;
  recipient: string;
  total: number;
  status: string;
  date: string;
}

export const demoOrders: DemoOrder[] = [
  {
    id: "order-1",
    order: "MK-1024",
    customer: "Jane Wanjiku",
    recipient: "Sarah Wanjiku",
    total: 4850,
    status: "Out for delivery",
    date: "28 Sep 2026",
  },
  {
    id: "order-2",
    order: "MK-1021",
    customer: "David Mwangi",
    recipient: "Mary Mwangi",
    total: 3200,
    status: "Delivered",
    date: "25 Sep 2026",
  },
  {
    id: "order-3",
    order: "MK-1017",
    customer: "Grace Njeri",
    recipient: "Peter Njoroge",
    total: 5750,
    status: "Delivered",
    date: "18 Sep 2026",
  },
  {
    id: "order-4",
    order: "MK-1012",
    customer: "Brian Otieno",
    recipient: "Lucy Achieng",
    total: 2800,
    status: "Processing",
    date: "10 Sep 2026",
  },
];

export interface DemoDelivery {
  id: string;
  order: string;
  recipient: string;
  area: string;
  slot: string;
  status: "Scheduled" | "Out for delivery" | "Delivered" | "Delayed";
}

export const demoDeliveries: DemoDelivery[] = [
  {
    id: "delivery-1",
    order: "MK-1024",
    recipient: "Sarah Wanjiku",
    area: "Westlands",
    slot: "10:00 AM – 12:00 PM",
    status: "Out for delivery",
  },
  {
    id: "delivery-2",
    order: "MK-1021",
    recipient: "Mary Mwangi",
    area: "Kilimani",
    slot: "12:00 PM – 2:00 PM",
    status: "Delivered",
  },
  {
    id: "delivery-3",
    order: "MK-1019",
    recipient: "James Kariuki",
    area: "Lavington",
    slot: "2:00 PM – 4:00 PM",
    status: "Scheduled",
  },
  {
    id: "delivery-4",
    order: "MK-1017",
    recipient: "Peter Njoroge",
    area: "Karen",
    slot: "4:00 PM – 6:00 PM",
    status: "Delivered",
  },
];

export interface DemoAuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  entity: string;
  details: string;
}

export const demoAuditLogs: DemoAuditLog[] = [
  {
    id: "audit-1",
    date: "28 Sep 2026, 14:32",
    user: "Admin",
    action: "Updated",
    entity: "Product",
    details:
      'Updated "Red Rose Bouquet" price from KES 4,500 to KES 4,850.',
  },
  {
    id: "audit-2",
    date: "28 Sep 2026, 11:18",
    user: "Admin",
    action: "Updated",
    entity: "Order",
    details: "Changed order MK-1024 status to Out for delivery.",
  },
  {
    id: "audit-3",
    date: "27 Sep 2026, 16:45",
    user: "Admin",
    action: "Created",
    entity: "Promotion",
    details:
      'Created promotion code "FLOWERS10" with a 10% discount.',
  },
  {
    id: "audit-4",
    date: "26 Sep 2026, 10:12",
    user: "Admin",
    action: "Updated",
    entity: "Delivery Zone",
    details: 'Updated delivery fee for "Westlands" to KES 350.',
  },
  {
    id: "audit-5",
    date: "25 Sep 2026, 15:27",
    user: "Admin",
    action: "Updated",
    entity: "Product",
    details:
      'Updated inventory for "White Lily Box" from 12 to 8 units.',
  },
  {
    id: "audit-6",
    date: "24 Sep 2026, 09:41",
    user: "Admin",
    action: "Created",
    entity: "Blog Post",
    details:
      'Created blog post "How to Choose the Perfect Birthday Flowers".',
  },
  {
    id: "audit-7",
    date: "23 Sep 2026, 13:06",
    user: "Admin",
    action: "Updated",
    entity: "Customer",
    details: "Updated contact details for customer Jane Wanjiku.",
  },
  {
    id: "audit-8",
    date: "22 Sep 2026, 17:20",
    user: "Admin",
    action: "Deleted",
    entity: "Promotion",
    details: 'Removed expired promotion code "WELCOME500".',
  },
];

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spend: number;
  joined: string;
}

export const demoCustomers: DemoCustomer[] = [
  {
    id: "customer-1",
    name: "Jane Wanjiku",
    email: "jane.wanjiku@example.com",
    phone: "+254 712 345 678",
    orders: 8,
    spend: 42600,
    joined: "12 Jan 2026",
  },
  {
    id: "customer-2",
    name: "David Mwangi",
    email: "david.mwangi@example.com",
    phone: "+254 723 456 789",
    orders: 5,
    spend: 28900,
    joined: "24 Feb 2026",
  },
  {
    id: "customer-3",
    name: "Grace Njeri",
    email: "grace.njeri@example.com",
    phone: "+254 734 567 890",
    orders: 11,
    spend: 68400,
    joined: "08 Mar 2026",
  },
  {
    id: "customer-4",
    name: "Brian Otieno",
    email: "brian.otieno@example.com",
    phone: "+254 745 678 901",
    orders: 4,
    spend: 19700,
    joined: "19 Apr 2026",
  },
  {
    id: "customer-5",
    name: "Lucy Achieng",
    email: "lucy.achieng@example.com",
    phone: "+254 756 789 012",
    orders: 7,
    spend: 35200,
    joined: "03 May 2026",
  },
  {
    id: "customer-6",
    name: "Peter Njoroge",
    email: "peter.njoroge@example.com",
    phone: "+254 767 890 123",
    orders: 3,
    spend: 16400,
    joined: "17 Jun 2026",
  },
  {
    id: "customer-7",
    name: "Mary Mwangi",
    email: "mary.mwangi@example.com",
    phone: "+254 778 901 234",
    orders: 9,
    spend: 48700,
    joined: "29 Jun 2026",
  },
  {
    id: "customer-8",
    name: "Sarah Wanjiku",
    email: "sarah.wanjiku@example.com",
    phone: "+254 789 012 345",
    orders: 6,
    spend: 31800,
    joined: "11 Jul 2026",
  },
];

export interface DemoRecipient {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  address: string;
  birthday?: string;
  anniversary?: string;
  notes?: string;
}

export const demoRecipients: DemoRecipient[] = [
  {
    id: "recipient-1",
    name: "Sarah Wanjiku",
    relationship: "Sister",
    phone: "+254 712 345 678",
    address: "Westlands, Nairobi",
    birthday: "14 Oct",
    anniversary: "",
    notes: "Prefers bright colours.",
  },
  {
    id: "recipient-2",
    name: "Mary Mwangi",
    relationship: "Wife",
    phone: "+254 723 456 789",
    address: "Kilimani, Nairobi",
    birthday: "22 Nov",
    anniversary: "18 Jun",
    notes: "Likes roses and lilies.",
  },
  {
    id: "recipient-3",
    name: "Peter Njoroge",
    relationship: "Friend",
    phone: "+254 734 567 890",
    address: "Karen, Nairobi",
    birthday: "05 Dec",
    anniversary: "",
    notes: "",
  },
  {
    id: "recipient-4",
    name: "Lucy Achieng",
    relationship: "Mother",
    phone: "+254 745 678 901",
    address: "Lavington, Nairobi",
    birthday: "09 May",
    anniversary: "",
    notes: "Usually sends flowers on Mother's Day.",
  },
  {
    id: "recipient-5",
    name: "James Kariuki",
    relationship: "Partner",
    phone: "+254 756 789 012",
    address: "Lavington, Nairobi",
    birthday: "27 Aug",
    anniversary: "12 Feb",
    notes: "Prefers elegant arrangements.",
  },
  {
    id: "recipient-6",
    name: "Anne Wambui",
    relationship: "Friend",
    phone: "+254 767 890 123",
    address: "Runda, Nairobi",
    birthday: "31 Jan",
    anniversary: "",
    notes: "",
  },
  {
    id: "recipient-7",
    name: "Michael Otieno",
    relationship: "Brother",
    phone: "+254 778 901 234",
    address: "Kasarani, Nairobi",
    birthday: "16 Mar",
    anniversary: "",
    notes: "Prefers same-day delivery.",
  },
  {
    id: "recipient-8",
    name: "Caroline Njeri",
    relationship: "Daughter",
    phone: "+254 789 012 345",
    address: "Parklands, Nairobi",
    birthday: "03 Jul",
    anniversary: "",
    notes: "Loves pastel bouquets.",
  },
];

export interface DemoTicket {
  id: string;
  subject: string;
  category: string;
  order: string;
  status: "Open" | "In progress" | "Resolved";
  updated: string;
}

export const demoTickets: DemoTicket[] = [
  {
    id: "ticket-1",
    subject: "When will my flowers arrive?",
    category: "Delivery",
    order: "MK-1024",
    status: "Open",
    updated: "28 Sep 2026, 14:18",
  },
  {
    id: "ticket-2",
    subject: "Payment completed but order is pending",
    category: "Payment",
    order: "MK-1021",
    status: "In progress",
    updated: "28 Sep 2026, 11:42",
  },
  {
    id: "ticket-3",
    subject: "Can I change the delivery address?",
    category: "Delivery",
    order: "MK-1019",
    status: "Resolved",
    updated: "27 Sep 2026, 16:05",
  },
  {
    id: "ticket-4",
    subject: "Wrong bouquet received",
    category: "Order",
    order: "MK-1017",
    status: "Resolved",
    updated: "26 Sep 2026, 13:27",
  },
  {
    id: "ticket-5",
    subject: "Can I add a greeting card?",
    category: "Order",
    order: "MK-1012",
    status: "Resolved",
    updated: "25 Sep 2026, 10:54",
  },
];


export interface InventoryRow {
  sku: string;
  item: string;
  available: number;
  reserved: number;
  reorder: number;
  cost: number;
  price: number;
  supplier: string;
}

export const inventoryRows: InventoryRow[] = [
  {
    sku: "FLW-001",
    item: "Classic Red Roses",
    available: 20,
    reserved: 4,
    reorder: 8,
    cost: 2800,
    price: 4500,
    supplier: "Nairobi Flower Market",
  },
  {
    sku: "FLW-002",
    item: "Pink Romance Bouquet",
    available: 15,
    reserved: 3,
    reorder: 6,
    cost: 3200,
    price: 5200,
    supplier: "Rose Valley Farms",
  },
  {
    sku: "FLW-003",
    item: "White Elegance",
    available: 6,
    reserved: 2,
    reorder: 8,
    cost: 4100,
    price: 6200,
    supplier: "Nairobi Flower Market",
  },
  {
    sku: "FLW-004",
    item: "Sunshine Bouquet",
    available: 14,
    reserved: 2,
    reorder: 6,
    cost: 2600,
    price: 4200,
    supplier: "Kiambu Growers",
  },
  {
    sku: "FLW-005",
    item: "Mixed Seasonal Bouquet",
    available: 4,
    reserved: 2,
    reorder: 8,
    cost: 2900,
    price: 4350,
    supplier: "Karura Flower Farm",
  },
  {
    sku: "FLW-006",
    item: "Premium Rose Box",
    available: 3,
    reserved: 1,
    reorder: 4,
    cost: 8500,
    price: 12500,
    supplier: "Rose Valley Farms",
  },
  {
    sku: "FLW-007",
    item: "Birthday Bloom",
    available: 11,
    reserved: 3,
    reorder: 5,
    cost: 3100,
    price: 4900,
    supplier: "Nairobi Flower Market",
  },
  {
    sku: "FLW-008",
    item: "Anniversary Romance",
    available: 10,
    reserved: 2,
    reorder: 5,
    cost: 4200,
    price: 6800,
    supplier: "Rose Valley Farms",
  },
  {
    sku: "FLW-009",
    item: "Valentine's Special",
    available: 4,
    reserved: 3,
    reorder: 6,
    cost: 6500,
    price: 8900,
    supplier: "Rose Valley Farms",
  },
  {
    sku: "FLW-010",
    item: "Mother's Day Collection",
    available: 8,
    reserved: 2,
    reorder: 5,
    cost: 3900,
    price: 6500,
    supplier: "Kiambu Growers",
  },
  {
    sku: "FLW-011",
    item: "Congratulations Bouquet",
    available: 8,
    reserved: 1,
    reorder: 4,
    cost: 2800,
    price: 4600,
    supplier: "Nairobi Flower Market",
  },
  {
    sku: "GFT-001",
    item: "Romantic Care Package",
    available: 9,
    reserved: 3,
    reorder: 5,
    cost: 7200,
    price: 9600,
    supplier: "Maua Gifts",
  },
  {
    sku: "GFT-002",
    item: "Get Well Soon Package",
    available: 13,
    reserved: 2,
    reorder: 5,
    cost: 6800,
    price: 9200,
    supplier: "Maua Gifts",
  },
  {
    sku: "GFT-003",
    item: "New Mum Care Package",
    available: 8,
    reserved: 2,
    reorder: 4,
    cost: 6200,
    price: 8500,
    supplier: "Maua Gifts",
  },
  {
    sku: "GFT-004",
    item: "Birthday Care Package",
    available: 11,
    reserved: 3,
    reorder: 5,
    cost: 6400,
    price: 8900,
    supplier: "Maua Gifts",
  },
  {
    sku: "GFT-005",
    item: "Self-Care Package",
    available: 16,
    reserved: 4,
    reorder: 6,
    cost: 5200,
    price: 7800,
    supplier: "Maua Gifts",
  },
];




export const revenueSeries = [
  { month: "Apr", revenue: 182000, orders: 48 },
  { month: "May", revenue: 224000, orders: 58 },
  { month: "Jun", revenue: 198000, orders: 52 },
  { month: "Jul", revenue: 267000, orders: 66 },
  { month: "Aug", revenue: 312000, orders: 78 },
  { month: "Sep", revenue: 348000, orders: 84 },
];

export const occasionSeries = [
  { occasion: "Birthday", orders: 42 },
  { occasion: "Anniversary", orders: 31 },
  { occasion: "Love", orders: 27 },
  { occasion: "Congratulations", orders: 19 },
  { occasion: "Thank You", orders: 15 },
];