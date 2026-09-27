/**
 * Maua.ke demo catalogue.
 * DEMO DATA — shaped to match the eventual API responses so components can be
 * swapped onto real endpoints without redesign.
 */
import redRoses from "@/assets/product-red-roses.jpg";
import pinkRomance from "@/assets/product-pink-romance.jpg";
import sunshine from "@/assets/product-sunshine.jpg";
import whiteBox from "@/assets/product-white-box.jpg";
import carePackageImg from "@/assets/care-package.jpg";

export type ProductKind = "bouquet" | "gift" | "card" | "care-package";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stems?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  kind: ProductKind;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  gallery: string[];
  category: string;
  occasions: string[];
  flowerType?: string;
  colors: string[];
  variants: ProductVariant[];
  stems?: number;
  vaseAvailable?: boolean;
  careInstructions?: string;
  includes?: string[];
  rating: number;
  reviewCount: number;
  availability: "in-stock" | "low-stock" | "out-of-stock";
  badge?: string;
}

export interface Occasion {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}

export interface FlowerCategory {
  slug: string;
  name: string;
  description: string;
}

export const occasions: Occasion[] = [
  {
    slug: "valentines",
    name: "Valentine's Day",
    tagline: "Say it with roses",
    description: "Romantic bouquets, roses and gifts sets for the one who has your heart.",
  },
  {
    slug: "birthday",
    name: "Birthdays",
    tagline: "Make their day bloom",
    description: "Bright birthday bouquets, cards and gifts boxes delivered on the day.",
  },
  {
    slug: "anniversary",
    name: "Anniversaries",
    tagline: "Another year of love",
    description: "Elegant arrangements and couple gifts to mark the milestone.",
  },
  {
    slug: "mothers-day",
    name: "Mother's Day",
    tagline: "For the woman who gave you everything",
    description: "Soft, generous bouquets and self-care packages for mum.",
  },
  {
    slug: "fathers-day",
    name: "Father's Day",
    tagline: "Thoughtful, not fussy",
    description: "Gift sets, cards and care packages built for dad.",
  },
  {
    slug: "graduation",
    name: "Graduation",
    tagline: "Hard work, celebrated",
    description: "Congratulations bouquets and gifts packages for the new graduate.",
  },
  {
    slug: "new-baby",
    name: "New Baby",
    tagline: "Welcome, little one",
    description: "Gentle blooms and new-parent care packages.",
  },
  {
    slug: "get-well",
    name: "Get Well Soon",
    tagline: "A little brightness",
    description: "Cheerful flowers and wellness packages to lift the spirits.",
  },
  {
    slug: "congratulations",
    name: "Congratulations",
    tagline: "Big news deserves flowers",
    description: "Celebration bouquets, cards and gifts boxes.",
  },
  {
    slug: "thank-you",
    name: "Thank You",
    tagline: "Gratitude, delivered",
    description: "Warm thank-you bouquets and small gifts.",
  },
  {
    slug: "sympathy",
    name: "Sympathy",
    tagline: "Quiet comfort",
    description: "Considered white arrangements and condolence cards.",
  },
  {
    slug: "just-because",
    name: "Just Because",
    tagline: "No reason needed",
    description: "Everyday surprise bouquets and small thoughtful gifts.",
  },
  {
    slug: "love-romance",
    name: "Love & Romance",
    tagline: "For the everyday romantics",
    description: "Roses, couple gifts and date-night packages.",
  },
];

export const flowerCategories: FlowerCategory[] = [
  { slug: "red-roses", name: "Red Roses", description: "Classic, deep and unmistakably romantic." },
  { slug: "pink-roses", name: "Pink Roses", description: "Soft, tender and endlessly gifts-able." },
  { slug: "white-roses", name: "White Roses", description: "Elegant blooms for calm, considered moments." },
  { slug: "mixed-bouquets", name: "Mixed Bouquets", description: "Seasonal blends arranged by our florists." },
  { slug: "tulips", name: "Tulips", description: "Fresh, modern and beautifully simple." },
  { slug: "lilies", name: "Lilies", description: "Fragrant and quietly dramatic." },
  { slug: "sunflowers", name: "Sunflowers", description: "Big, bright and impossible to ignore." },
  { slug: "orchids", name: "Orchids", description: "Long-lasting, sculptural and premium." },
  { slug: "flower-boxes", name: "Flower Boxes", description: "Hat-box arrangements that arrive ready to display." },
  { slug: "premium-bouquets", name: "Premium Bouquets", description: "Our largest, most generous designs." },
];

export const flowerColors = [
  { slug: "red", name: "Red" },
  { slug: "pink", name: "Pink" },
  { slug: "white", name: "White" },
  { slug: "yellow", name: "Yellow" },
  { slug: "purple", name: "Purple" },
  { slug: "orange", name: "Orange" },
  { slug: "mixed", name: "Mixed" },
];

export const priceBands = [
  { slug: "under-2000", label: "Under KES 2,000", min: 0, max: 2000 },
  { slug: "2000-3500", label: "KES 2,000 – 3,500", min: 2000, max: 3500 },
  { slug: "3500-5000", label: "KES 3,500 – 5,000", min: 3500, max: 5000 },
  { slug: "5000-10000", label: "KES 5,000 – 10,000", min: 5000, max: 10000 },
  { slug: "premium", label: "Premium Gifts", min: 10000, max: 1000000 },
];

const sizes = (base: number, stems: number): ProductVariant[] => [
  { id: "sm", name: "Small", price: base, stems, stock: 24 },
  { id: "md", name: "Medium", price: Math.round(base * 1.4), stems: stems * 2, stock: 18 },
  { id: "lg", name: "Large", price: Math.round(base * 2), stems: stems * 3, stock: 9 },
  { id: "xl", name: "Premium", price: Math.round(base * 3.2), stems: stems * 4, stock: 4 },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Classic Red Roses",
    slug: "classic-red-roses",
    kind: "bouquet",
    description:
      "A dozen long-stem red roses hand-tied in cream wrap and finished with satin ribbon. The bouquet people reach for when the words are hard.",
    price: 4500,
    compareAtPrice: 5200,
    // After:
    image: redRoses.src,
    gallery: [redRoses.src, pinkRomance.src, whiteBox.src],
    category: "red-roses",
    occasions: ["valentines", "love-romance", "anniversary"],
    flowerType: "Roses",
    colors: ["red"],
    variants: sizes(4500, 12),
    stems: 12,
    vaseAvailable: true,
    careInstructions: "Trim stems at an angle, change water every two days and keep out of direct sun.",
    rating: 4.9,
    reviewCount: 214,
    availability: "in-stock",
    badge: "Bestseller",
  },
  {
    id: "p2",
    name: "Pink Romance Bouquet",
    slug: "pink-romance-bouquet",
    kind: "bouquet",
    description:
      "Blush and peach roses layered with baby's breath — soft, romantic and endlessly photogenic.",
    price: 3800,
    image: pinkRomance.src,
    gallery: [pinkRomance.src, redRoses.src],
    category: "pink-roses",
    occasions: ["love-romance", "birthday", "just-because"],
    flowerType: "Roses",
    colors: ["pink"],
    variants: sizes(3800, 9),
    stems: 9,
    vaseAvailable: true,
    careInstructions: "Keep in a cool room and top up the water daily.",
    rating: 4.8,
    reviewCount: 132,
    availability: "in-stock",
  },
  {
    id: "p3",
    name: "White Elegance",
    slug: "white-elegance",
    kind: "bouquet",
    description: "White roses and lilies in a cream hat box — calm, considered and ready to display.",
    price: 6200,
    image: whiteBox.src,
    gallery: [whiteBox.src],
    category: "flower-boxes",
    occasions: ["sympathy", "congratulations", "new-baby"],
    flowerType: "Roses & Lilies",
    colors: ["white"],
    variants: sizes(6200, 15),
    stems: 15,
    careInstructions: "The box holds a hydrated foam base — add a splash of water every other day.",
    rating: 4.9,
    reviewCount: 78,
    availability: "in-stock",
    badge: "Florist's pick",
  },
  {
    id: "p4",
    name: "Sunshine Bouquet",
    slug: "sunshine-bouquet",
    kind: "bouquet",
    description: "Sunflowers and yellow tulips in kraft wrap. Instantly cheerful.",
    price: 3200,
    image: sunshine.src,
    gallery: [sunshine.src],
    category: "sunflowers",
    occasions: ["get-well", "birthday", "thank-you", "just-because"],
    flowerType: "Sunflowers",
    colors: ["yellow"],
    variants: sizes(3200, 7),
    stems: 7,
    rating: 4.7,
    reviewCount: 96,
    availability: "in-stock",
  },
  {
    id: "p5",
    name: "Mixed Seasonal Bouquet",
    slug: "mixed-seasonal-bouquet",
    kind: "bouquet",
    description: "Whatever is freshest at the market that morning, arranged by our florists.",
    price: 2900,
    image: pinkRomance.src,
    gallery: [pinkRomance.src, sunshine.src],
    category: "mixed-bouquets",
    occasions: ["just-because", "thank-you", "birthday"],
    flowerType: "Seasonal mix",
    colors: ["mixed"],
    variants: sizes(2900, 10),
    stems: 10,
    rating: 4.6,
    reviewCount: 54,
    availability: "low-stock",
  },
  {
    id: "p6",
    name: "Premium Rose Box",
    slug: "premium-rose-box",
    kind: "bouquet",
    description: "Fifty roses arranged in a deep signature box. Our most generous gesture.",
    price: 12500,
    image: redRoses.src,
    gallery: [redRoses.src, whiteBox.src],
    category: "premium-bouquets",
    occasions: ["valentines", "anniversary", "love-romance"],
    flowerType: "Roses",
    colors: ["red", "pink"],
    variants: sizes(12500, 50),
    stems: 50,
    rating: 5,
    reviewCount: 41,
    availability: "low-stock",
    badge: "Premium",
  },
  {
    id: "p7",
    name: "Birthday Bloom",
    slug: "birthday-bloom",
    kind: "bouquet",
    description: "A bright, celebratory mix with a birthday card tucked in.",
    price: 3500,
    image: sunshine.src,
    gallery: [sunshine.src, pinkRomance.src],
    category: "mixed-bouquets",
    occasions: ["birthday"],
    flowerType: "Seasonal mix",
    colors: ["mixed", "yellow"],
    variants: sizes(3500, 10),
    stems: 10,
    rating: 4.8,
    reviewCount: 118,
    availability: "in-stock",
  },
  {
    id: "p8",
    name: "Anniversary Romance",
    slug: "anniversary-romance",
    kind: "bouquet",
    description: "Red and blush roses with eucalyptus, wrapped for the occasion.",
    price: 5600,
    compareAtPrice: 6400,
    image: redRoses.src,
    gallery: [redRoses.src, pinkRomance.src],
    category: "red-roses",
    occasions: ["anniversary", "love-romance"],
    flowerType: "Roses",
    colors: ["red", "pink"],
    variants: sizes(5600, 18),
    stems: 18,
    rating: 4.9,
    reviewCount: 63,
    availability: "in-stock",
  },
  {
    id: "p9",
    name: "Valentine's Special",
    slug: "valentines-special",
    kind: "bouquet",
    description: "Twenty-four red roses, chocolates and a handwritten card. Order early — February sells out.",
    price: 8900,
    image: redRoses.src,
    gallery: [redRoses.src, carePackageImg.src],
    category: "premium-bouquets",
    occasions: ["valentines", "love-romance"],
    flowerType: "Roses",
    colors: ["red"],
    variants: sizes(8900, 24),
    stems: 24,
    rating: 4.9,
    reviewCount: 187,
    availability: "in-stock",
    badge: "Seasonal",
  },
  {
    id: "p10",
    name: "Mother's Day Collection",
    slug: "mothers-day-collection",
    kind: "bouquet",
    description: "Soft pastel blooms with a keepsake vase — made for mum.",
    price: 5400,
    image: pinkRomance.src,
    gallery: [pinkRomance.src, whiteBox.src],
    category: "mixed-bouquets",
    occasions: ["mothers-day", "thank-you"],
    flowerType: "Seasonal mix",
    colors: ["pink", "white"],
    variants: sizes(5400, 15),
    stems: 15,
    vaseAvailable: true,
    rating: 4.9,
    reviewCount: 92,
    availability: "in-stock",
  },
  {
    id: "p11",
    name: "Congratulations Bouquet",
    slug: "congratulations-bouquet",
    kind: "bouquet",
    description: "A confident, colourful arrangement for graduations, promotions and big wins.",
    price: 4100,
    image: sunshine.src,
    gallery: [sunshine.src],
    category: "mixed-bouquets",
    occasions: ["congratulations", "graduation"],
    flowerType: "Seasonal mix",
    colors: ["mixed", "orange"],
    variants: sizes(4100, 12),
    stems: 12,
    rating: 4.7,
    reviewCount: 37,
    availability: "in-stock",
  },
  {
    id: "p12",
    name: "Romantic Care Package",
    slug: "romantic-care-package",
    kind: "care-package",
    description: "Roses, chocolates, a soy candle and a personalised card, boxed and ribboned.",
    price: 7200,
    image: carePackageImg.src,
    gallery: [carePackageImg.src, redRoses.src],
    category: "care-packages",
    occasions: ["valentines", "anniversary", "love-romance"],
    colors: ["red"],
    variants: [
      { id: "std", name: "Standard", price: 7200, stock: 12 },
      { id: "lux", name: "Luxe", price: 10500, stock: 5 },
    ],
    includes: ["12 red roses", "Belgian chocolates", "Soy candle", "Greeting card"],
    rating: 4.9,
    reviewCount: 58,
    availability: "in-stock",
    badge: "Care package",
  },
  {
    id: "p13",
    name: "Get Well Soon Package",
    slug: "get-well-soon-package",
    kind: "care-package",
    description: "Bright blooms with fruit, tea and honey to help someone feel human again.",
    price: 5900,
    image: carePackageImg.src,
    gallery: [carePackageImg.src, sunshine.src],
    category: "care-packages",
    occasions: ["get-well"],
    colors: ["yellow", "mixed"],
    variants: [{ id: "std", name: "Standard", price: 5900, stock: 15 }],
    includes: ["Seasonal bouquet", "Fruit selection", "Herbal tea", "Local honey", "Card"],
    rating: 4.8,
    reviewCount: 44,
    availability: "in-stock",
  },
  {
    id: "p14",
    name: "New Mum Care Package",
    slug: "new-mum-care-package",
    kind: "care-package",
    description: "Gentle flowers, self-care items and snacks for the first weeks at home.",
    price: 6800,
    image: carePackageImg.src,
    gallery: [carePackageImg.src, whiteBox.src],
    category: "care-packages",
    occasions: ["new-baby"],
    colors: ["white", "pink"],
    variants: [{ id: "std", name: "Standard", price: 6800, stock: 10 }],
    includes: ["Soft pastel bouquet", "Body care set", "Snack box", "Baby keepsake", "Card"],
    rating: 4.9,
    reviewCount: 29,
    availability: "in-stock",
  },
  {
    id: "p15",
    name: "Birthday Care Package",
    slug: "birthday-care-package",
    kind: "care-package",
    description: "Flowers, cake, a balloon and a card — a whole celebration in one box.",
    price: 6400,
    image: carePackageImg.src,
    gallery: [carePackageImg.src, sunshine.src],
    category: "care-packages",
    occasions: ["birthday"],
    colors: ["mixed"],
    variants: [{ id: "std", name: "Standard", price: 6400, stock: 14 }],
    includes: ["Birthday bouquet", "Mini cake", "Balloon", "Greeting card"],
    rating: 4.8,
    reviewCount: 66,
    availability: "in-stock",
  },
  {
    id: "p16",
    name: "Self-Care Package",
    slug: "self-care-package",
    kind: "care-package",
    description: "Flowers, candle, tea, chocolate and body care — for a slow, kind evening.",
    price: 5200,
    image: carePackageImg.src,
    gallery: [carePackageImg.src],
    category: "care-packages",
    occasions: ["just-because", "thank-you"],
    colors: ["mixed"],
    variants: [{ id: "std", name: "Standard", price: 5200, stock: 20 }],
    includes: ["Small bouquet", "Soy candle", "Chocolate", "Herbal tea", "Body care"],
    rating: 4.7,
    reviewCount: 33,
    availability: "in-stock",
  },
];

export interface GreetingCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  preview: string;
}

export const greetingCards: GreetingCard[] = [
  { id: "c1", name: "Happy Birthday — Blooms", slug: "birthday-blooms", category: "Birthday", price: 350, preview: "Wishing you a day as lovely as you are." },
  { id: "c2", name: "With All My Love", slug: "with-all-my-love", category: "Love", price: 400, preview: "Every day with you is my favourite day." },
  { id: "c3", name: "Be Mine — Valentine's", slug: "be-mine", category: "Valentine's", price: 450, preview: "Still choosing you." },
  { id: "c4", name: "Happy Anniversary", slug: "happy-anniversary", category: "Anniversary", price: 400, preview: "Another year, still us." },
  { id: "c5", name: "For Mum", slug: "for-mum", category: "Mother's Day", price: 400, preview: "Thank you for everything, always." },
  { id: "c6", name: "For Dad", slug: "for-dad", category: "Father's Day", price: 400, preview: "Thanks for showing me how." },
  { id: "c7", name: "Congratulations!", slug: "congratulations", category: "Congratulations", price: 350, preview: "You did the thing. Well done." },
  { id: "c8", name: "Thank You", slug: "thank-you", category: "Thank You", price: 300, preview: "Grateful for you." },
  { id: "c9", name: "Get Well Soon", slug: "get-well-soon", category: "Get Well Soon", price: 300, preview: "Rest up — the world can wait." },
  { id: "c10", name: "With Sympathy", slug: "with-sympathy", category: "Sympathy", price: 350, preview: "Thinking of you and your family." },
  { id: "c11", name: "Welcome Little One", slug: "welcome-little-one", category: "New Baby", price: 350, preview: "Congratulations on your new arrival." },
  { id: "c12", name: "Congratulations Graduate", slug: "congratulations-graduate", category: "Graduation", price: 350, preview: "All that work paid off." },
  { id: "c13", name: "Merry Christmas", slug: "merry-christmas", category: "Christmas", price: 400, preview: "Warmest wishes this season." },
  { id: "c14", name: "Just Because", slug: "just-because", category: "Just Because", price: 300, preview: "No reason. Just thought of you." },
];

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const addOns: AddOn[] = [
  { id: "a1", name: "Belgian chocolates", price: 1200 },
  { id: "a2", name: "Mini celebration cake", price: 2200 },
  { id: "a3", name: "Helium balloon", price: 600 },
  { id: "a4", name: "Teddy bear", price: 1800 },
  { id: "a5", name: "Soy candle", price: 1400 },
  { id: "a6", name: "Fruit basket", price: 2600 },
  { id: "a7", name: "Premium gift wrapping", price: 500 },
  { id: "a8", name: "Glass vase", price: 1500 },
];

export interface DeliveryZone {
  slug: string;
  name: string;
  fee: number;
  sameDay: boolean;
  cutoff: string;
}

export const deliveryZones: DeliveryZone[] = [
  { slug: "nairobi-cbd", name: "Nairobi — CBD & Westlands", fee: 300, sameDay: true, cutoff: "3:00 PM" },
  { slug: "nairobi-suburbs", name: "Nairobi — Suburbs", fee: 450, sameDay: true, cutoff: "1:00 PM" },
  { slug: "kiambu", name: "Kiambu", fee: 600, sameDay: true, cutoff: "12:00 PM" },
  { slug: "machakos", name: "Machakos", fee: 750, sameDay: false, cutoff: "—" },
  { slug: "mombasa", name: "Mombasa", fee: 900, sameDay: false, cutoff: "—" },
  { slug: "kisumu", name: "Kisumu", fee: 900, sameDay: false, cutoff: "—" },
  { slug: "nakuru", name: "Nakuru", fee: 800, sameDay: false, cutoff: "—" },
  { slug: "eldoret", name: "Eldoret", fee: 950, sameDay: false, cutoff: "—" },
];

export const deliverySlots = [
  { id: "morning", label: "Morning", window: "9:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", window: "12:00 PM – 4:00 PM" },
  { id: "evening", label: "Evening", window: "4:00 PM – 8:00 PM" },
];

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export const reviews: Review[] = [
  { id: "r1", productSlug: "classic-red-roses", author: "Wanjiru M.", rating: 5, title: "She cried (happy tears)", comment: "Delivered to Kilimani before noon and the roses were still cold to the touch. Beautiful.", date: "2026-07-12", verified: true },
  { id: "r2", productSlug: "classic-red-roses", author: "Brian O.", rating: 5, title: "Exactly as pictured", comment: "Ordered from Mombasa for someone in Nairobi. The tracking updates were reassuring.", date: "2026-06-28", verified: true },
  { id: "r3", productSlug: "pink-romance-bouquet", author: "Aisha K.", rating: 4, title: "Lovely bouquet", comment: "Gorgeous blooms. I'd have liked a slightly bigger wrap for the price.", date: "2026-05-19", verified: true },
  { id: "r4", productSlug: "sunshine-bouquet", author: "Peter N.", rating: 5, title: "Cheered mum right up", comment: "Sent to hospital and the nurses said it lit up the room.", date: "2026-08-02", verified: true },
  { id: "r5", productSlug: "romantic-care-package", author: "Faith C.", rating: 5, title: "Worth every shilling", comment: "The candle and chocolates made it feel like a proper gifts, not just flowers.", date: "2026-07-30", verified: true },
];

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "valentines-flower-guide",
    title: "What Flowers Should You Send for Valentine's Day?",
    category: "Valentine's",
    excerpt: "Red roses are the default — but they are not the only right answer.",
    date: "2026-01-20",
    readTime: "4 min read",
    body: [
      "Red roses carry the clearest message, which is exactly why they sell out first every February. If you want certainty, order them early — Nairobi stock tightens from the 10th.",
      "If your relationship is newer, blush or peach roses read as warm rather than declarative. For long marriages, a mixed premium bouquet with a handwritten card usually lands better than a repeat of last year.",
      "Whatever you choose, book the delivery window in advance. On the 14th, morning slots go first.",
    ],
  },
  {
    slug: "meaning-of-rose-colours",
    title: "The Meaning of Different Rose Colours",
    category: "Flower Guides",
    excerpt: "A short, practical guide to what each colour tends to communicate.",
    date: "2026-02-14",
    readTime: "3 min read",
    body: [
      "Red is romantic love. White is respect, remembrance and new beginnings. Pink covers gratitude, admiration and gentle affection.",
      "Yellow roses read as friendship and cheer — a good choice for a colleague or a friend recovering from illness.",
      "Mixing colours softens the message, which is often what you want when the occasion is celebratory rather than romantic.",
    ],
  },
  {
    slug: "keep-your-bouquet-fresh",
    title: "How to Keep Your Bouquet Fresh Longer",
    category: "Flower Care",
    excerpt: "Five habits that add days to the life of cut flowers.",
    date: "2026-03-04",
    readTime: "3 min read",
    body: [
      "Trim two centimetres off the stems at a 45-degree angle the moment the bouquet arrives, and do it again every three days.",
      "Change the water completely rather than topping it up. Cloudy water is bacteria, and bacteria block the stems.",
      "Keep the vase away from direct sun, ripening fruit and open windows. Cool and shaded is what you want in a Nairobi afternoon.",
    ],
  },
  {
    slug: "best-flowers-for-a-birthday",
    title: "Best Flowers for a Birthday",
    category: "Birthdays",
    excerpt: "Choosing by personality rather than by price.",
    date: "2026-04-11",
    readTime: "4 min read",
    body: [
      "For someone bold, sunflowers and bright mixed blooms are hard to beat. For someone quieter, a small arrangement of tulips or white roses feels more considered.",
      "Adding a cake or balloon turns a bouquet into an event, which matters more when you cannot be there in person.",
      "Set a reminder in your account so next year's order takes thirty seconds.",
    ],
  },
  {
    slug: "anniversary-flower-guide",
    title: "The Perfect Anniversary Flower Guide",
    category: "Relationships",
    excerpt: "Matching the bouquet to the milestone.",
    date: "2026-05-22",
    readTime: "5 min read",
    body: [
      "First anniversaries suit something close to the wedding palette. Later milestones justify scale — this is where a premium rose box earns its price.",
      "A personal message beats an expensive add-on almost every time. Write the specific thing, not the general thing.",
      "If you are both travelling, schedule delivery to wherever they will actually be that morning.",
    ],
  },
];

export const testimonials = [
  { name: "Njeri W.", location: "Lavington, Nairobi", quote: "I ordered at 10am for my sister's birthday and it arrived before lunch. She sent me a video crying." },
  { name: "Samuel K.", location: "Nyali, Mombasa", quote: "Being able to save recipients means my mum gets flowers every Mother's Day without me scrambling." },
  { name: "Grace A.", location: "Kilimani, Nairobi", quote: "The care package was beautifully boxed. It felt like something from a boutique, not a delivery app." },
];

export const currency = (value: number) =>
  `KES ${value.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug);
export const getCategory = (slug: string) => flowerCategories.find((c) => c.slug === slug);
export const productsByOccasion = (slug: string) => products.filter((p) => p.occasions.includes(slug));
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const reviewsFor = (slug: string) => reviews.filter((r) => r.productSlug === slug);

export const searchProducts = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((p) => {
      const haystack = [
        p.name,
        p.description,
        p.category,
        p.flowerType ?? "",
        ...p.colors,
        ...p.occasions.map((o) => getOccasion(o)?.name ?? o),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      return { product: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);
};

export const popularSearches = ["valentine roses", "birthday bouquet", "red roses", "care package", "sunflowers"];
