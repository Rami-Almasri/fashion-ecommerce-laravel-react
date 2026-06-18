// PETIT MONDE — local catalog.
// Used as a graceful fallback when the Laravel API is unavailable, and as the
// seed reference for the backend. All imagery is hotlinked from Unsplash.

const u = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES = [
  { id: 1, type: 'Baby', slug: 'baby', blurb: '0–24 months', image: u('photo-1711313532755-47fe78c65a50', 700) },
  { id: 2, type: 'Girls', slug: 'girls', blurb: '2–12 years', image: u('photo-1695262620884-b1fdb55a631e', 700) },
  { id: 3, type: 'Boys', slug: 'boys', blurb: '2–12 years', image: u('photo-1758782213532-bbb5fd89885e', 700) },
  { id: 4, type: 'Essentials', slug: 'essentials', blurb: 'Every day', image: u('photo-1528145203756-0ed7f01ee120', 700) },
];

// Product "type" values mirror the backend enum.
export const PRODUCT_TYPES = [
  'pajamas', 'sweater', 'pants', 'jacket', 't-shirt',
  'suit', 'dress', 'jumpsuit', 'hoodie', 'shorts', 'skirt',
];

export const SEASONS = ['summer', 'winter'];

const SIZE_GUIDE_KIDS = {
  unit: 'cm',
  rows: [
    { label: '3–6m', age: '3–6 months', height: '62–68', chest: '44', waist: '44' },
    { label: '6–12m', age: '6–12 months', height: '68–76', chest: '47', waist: '46' },
    { label: '1–2y', age: '1–2 years', height: '80–92', chest: '52', waist: '50' },
    { label: '3–4y', age: '3–4 years', height: '98–104', chest: '55', waist: '53' },
    { label: '5–6y', age: '5–6 years', height: '110–116', chest: '59', waist: '56' },
    { label: '7–8y', age: '7–8 years', height: '122–128', chest: '64', waist: '59' },
    { label: '9–10y', age: '9–10 years', height: '134–140', chest: '69', waist: '63' },
    { label: '11–12y', age: '11–12 years', height: '146–152', chest: '76', waist: '67' },
  ],
};

const C = {
  ecru: { name: 'Ecru', hex: '#EFE7DA' },
  clay: { name: 'Clay', hex: '#B86E48' },
  sage: { name: 'Sage', hex: '#8AA26F' },
  sky: { name: 'Sky', hex: '#A9C4D4' },
  blush: { name: 'Blush', hex: '#E7B7AE' },
  navy: { name: 'Navy', hex: '#2E3A4B' },
  mustard: { name: 'Mustard', hex: '#D8A24A' },
  charcoal: { name: 'Charcoal', hex: '#33312E' },
  ivory: { name: 'Ivory', hex: '#F7F2E9' },
  rust: { name: 'Rust', hex: '#A65A3A' },
};

export const PRODUCTS = [
  {
    id: 1,
    slug: 'coraline-floral-set',
    name: 'Coraline Floral Set',
    type: 'suit',
    category: 'Boys',
    season: 'summer',
    price: 48,
    originalPrice: 62,
    rating: 4.8,
    reviews: 124,
    badges: ['sale', 'bestseller'],
    description:
      'A breezy two-piece in a hand-drawn floral print — a soft collared shirt paired with matching pull-on shorts. Cut from airy cotton poplin that keeps little ones cool through long summer days.',
    details: ['Cotton poplin, 100% organic', 'Coconut shell buttons', 'Elastic waist shorts', 'Machine wash cold'],
    colors: [C.sage, C.ecru],
    images: [u('photo-1502451885777-16c98b07834a'), u('photo-1604303768345-038b79a8c47a')],
  },
  {
    id: 2,
    slug: 'marguerite-tee-shorts',
    name: 'Marguerite Tee & Shorts',
    type: 'shorts',
    category: 'Girls',
    season: 'summer',
    price: 36,
    rating: 4.6,
    reviews: 88,
    badges: ['new'],
    description:
      'Monochrome made playful. A relaxed jersey tee tucked into crisp white shorts — the everyday set that mixes with everything in the drawer.',
    details: ['Combed cotton jersey', 'Pre-washed for softness', 'Roll-up cuffs', 'GOTS certified'],
    colors: [C.ivory, C.charcoal, C.blush],
    images: [u('photo-1604482858862-1db908a653e4')],
  },
  {
    id: 3,
    slug: 'breton-stripe-tee',
    name: 'Breton Stripe Tee',
    type: 't-shirt',
    category: 'Boys',
    season: 'summer',
    price: 28,
    rating: 4.9,
    reviews: 213,
    badges: ['bestseller'],
    description:
      'The little sailor classic. Yarn-dyed stripes on a heavyweight jersey that only gets better with every wash. Styled here with denim shorts for off-duty days.',
    details: ['260gsm cotton jersey', 'Yarn-dyed stripes', 'Ribbed crew neck', 'Made in Portugal'],
    colors: [C.navy, C.clay, C.sage],
    images: [
      u('photo-1627639679690-db4d401aae84'),
      u('photo-1627639679608-993e305c1f2c'),
      u('photo-1627639678221-db426a961ba1'),
      u('photo-1627639678232-1d3bcbcc1042'),
    ],
  },
  {
    id: 4,
    slug: 'linen-button-shirt',
    name: 'Linen Button Shirt',
    type: 't-shirt',
    category: 'Boys',
    season: 'summer',
    price: 42,
    rating: 4.7,
    reviews: 64,
    badges: [],
    description:
      'A grown-up shirt scaled down. Washed linen with a soft camp collar and a relaxed fit — equal parts holiday and family photos.',
    details: ['100% washed linen', 'Camp collar', 'Chest patch pocket', 'Naturally breathable'],
    colors: [C.sky, C.rust, C.ecru],
    images: [u('photo-1602863211758-e35574d21b22')],
  },
  {
    id: 5,
    slug: 'teddy-knit-sweater',
    name: 'Teddy Knit Sweater',
    type: 'sweater',
    category: 'Baby',
    season: 'winter',
    price: 54,
    rating: 5.0,
    reviews: 156,
    badges: ['bestseller'],
    description:
      'Cloud-soft merino knit with a roomy fit for layering over onesies. Your tiniest one will live in this all winter long — teddy not included.',
    details: ['Extra-fine merino wool', 'Shoulder snap opening', 'Hypoallergenic', 'Hand wash recommended'],
    colors: [C.ecru, C.clay, C.mustard],
    images: [u('photo-1703282581360-a3685b2d52ac')],
  },
  {
    id: 6,
    slug: 'cloud-knit-cardigan',
    name: 'Cloud Knit Cardigan',
    type: 'sweater',
    category: 'Baby',
    season: 'winter',
    price: 46,
    rating: 4.8,
    reviews: 97,
    badges: ['new'],
    description:
      'An heirloom-worthy cardigan in a chunky cloud knit, finished with smooth shell buttons. Pairs with the matching polka shorts for a complete look.',
    details: ['Organic cotton blend', 'Shell buttons', 'Ribbed trims', 'Oeko-Tex certified'],
    colors: [C.ivory, C.sage],
    images: [u('photo-1608093602519-ccd31f515f83')],
  },
  {
    id: 7,
    slug: 'pique-polo',
    name: 'Piqué Polo',
    type: 't-shirt',
    category: 'Boys',
    season: 'summer',
    price: 32,
    rating: 4.5,
    reviews: 71,
    badges: [],
    description:
      'A breathable piqué polo with a tipped collar — the smart-casual staple for everything from playdates to grandma’s birthday.',
    details: ['Cotton piqué', 'Tipped ribbed collar', 'Two-button placket', 'Machine washable'],
    colors: [C.sky, C.navy, C.ivory],
    images: [u('photo-1603792273674-543a44863980')],
  },
  {
    id: 8,
    slug: 'dreamer-onesie',
    name: 'Dreamer Onesie',
    type: 'pajamas',
    category: 'Baby',
    season: 'winter',
    price: 34,
    rating: 4.9,
    reviews: 188,
    badges: ['bestseller'],
    description:
      'The softest sleep there is. A footed onesie in brushed organic cotton with fold-over mitts and easy two-way zip for midnight changes.',
    details: ['Brushed organic cotton', 'Two-way YKK zip', 'Fold-over cuffs', 'Tagless for comfort'],
    colors: [C.ecru, C.blush, C.sky],
    images: [u('photo-1711313532755-47fe78c65a50')],
  },
  {
    id: 9,
    slug: 'little-gent-suit',
    name: 'Little Gent Suit',
    type: 'suit',
    category: 'Boys',
    season: 'winter',
    price: 89,
    originalPrice: 110,
    rating: 4.7,
    reviews: 52,
    badges: ['sale'],
    description:
      'For the occasions that matter. A tailored waistcoat, trousers and a finishing tie — proportioned for little gentlemen, soft enough to dance in.',
    details: ['Wool-touch suiting', 'Adjustable waistcoat', 'Clip-on tie included', 'Dry clean'],
    colors: [C.charcoal, C.navy],
    images: [u('photo-1725147874938-7904e3362841')],
  },
  {
    id: 10,
    slug: 'heritage-plaid-shirt',
    name: 'Heritage Plaid Shirt',
    type: 't-shirt',
    category: 'Boys',
    season: 'winter',
    price: 38,
    rating: 4.6,
    reviews: 43,
    badges: [],
    description:
      'A brushed flannel check that feels like a hug. Generously cut to layer over tees when the temperature drops.',
    details: ['Brushed cotton flannel', 'Curved hem', 'Corozo buttons', 'Machine wash warm'],
    colors: [C.rust, C.navy, C.sage],
    images: [u('photo-1604303768345-038b79a8c47a')],
  },
  {
    id: 11,
    slug: 'camille-tiered-dress',
    name: 'Camille Tiered Dress',
    type: 'dress',
    category: 'Girls',
    season: 'summer',
    price: 58,
    rating: 4.9,
    reviews: 167,
    badges: ['bestseller', 'new'],
    description:
      'Twirl-tested and approved. Three airy tiers of cotton voile with a smocked bodice that grows with her. The dress for sun-drenched afternoons.',
    details: ['Cotton voile', 'Smocked stretch bodice', 'Lined skirt', 'Machine wash cold'],
    colors: [C.ivory, C.blush, C.mustard],
    images: [u('photo-1695262620884-b1fdb55a631e')],
  },
  {
    id: 12,
    slug: 'bluebell-puffer-jacket',
    name: 'Bluebell Puffer Jacket',
    type: 'jacket',
    category: 'Girls',
    season: 'winter',
    price: 74,
    rating: 4.8,
    reviews: 119,
    badges: ['bestseller'],
    description:
      'Lightweight warmth for frosty mornings. A water-repellent shell with recycled down-alternative fill and a cosy fold-up hood.',
    details: ['Recycled polyester shell', 'Water-repellent finish', 'Fleece-lined pockets', 'Packable hood'],
    colors: [C.sky, C.blush, C.sage],
    images: [u('photo-1695263747144-a52aa3739d62')],
  },
  {
    id: 13,
    slug: 'noir-tracksuit',
    name: 'Noir Track Set',
    type: 'hoodie',
    category: 'Boys',
    season: 'winter',
    price: 64,
    rating: 4.7,
    reviews: 81,
    badges: ['new'],
    description:
      'Street-smart and stage-ready. A heavyweight loopback hoodie and tapered joggers in deep noir — the coolest kid in the room, sorted.',
    details: ['Heavyweight loopback cotton', 'Brushed inner', 'Tapered jogger fit', 'Ribbed cuffs'],
    colors: [C.charcoal, C.navy, C.clay],
    images: [u('photo-1758782213532-bbb5fd89885e')],
  },
  {
    id: 14,
    slug: 'rainbow-crew-tee',
    name: 'Rainbow Crew Tee',
    type: 't-shirt',
    category: 'Essentials',
    season: 'summer',
    price: 24,
    rating: 4.8,
    reviews: 240,
    badges: ['bestseller'],
    description:
      'The one they’ll reach for every morning. A vivid multicolour crew in buttery organic jersey — sold solo or in a play-all-day three-pack.',
    details: ['Organic cotton jersey', 'Set-in sleeves', 'Ribbed neckband', 'Pre-shrunk'],
    colors: [C.mustard, C.sage, C.sky, C.blush],
    images: [u('photo-1528145203756-0ed7f01ee120')],
  },
  {
    id: 15,
    slug: 'sunday-hoodie-set',
    name: 'Sunday Hoodie Set',
    type: 'hoodie',
    category: 'Baby',
    season: 'winter',
    price: 44,
    rating: 4.6,
    reviews: 58,
    badges: [],
    description:
      'Lazy-morning softness in a French-terry hoodie and matching joggers. Roomy enough for nappies, snug enough for naps in the pram.',
    details: ['French terry cotton', 'Envelope neckline', 'Fold-over cuffs', 'Machine wash cold'],
    colors: [C.ecru, C.sage, C.clay],
    images: [u('flagged/photo-1555895312-fc2610acaeb3')],
  },
  {
    id: 16,
    slug: 'meadow-denim-shorts',
    name: 'Meadow Denim Shorts',
    type: 'shorts',
    category: 'Essentials',
    season: 'summer',
    price: 30,
    rating: 4.5,
    reviews: 66,
    badges: [],
    description:
      'Proper little denim shorts with an adjustable waist and just-right length. Built to survive the playground and the wash, on repeat.',
    details: ['Stretch denim', 'Adjustable inner waistband', 'Five-pocket styling', 'Reinforced seams'],
    colors: [C.sky, C.navy],
    images: [u('photo-1627639678232-1d3bcbcc1042')],
  },
];

// Build deterministic size/colour/stock variants for a product, matching the
// backend product_variants schema (size, color, stock, age, age_type).
const SIZES_BY_CATEGORY = {
  Baby: [
    { size: '3-6m', age: '3-6', age_type: 'month' },
    { size: '6-12m', age: '6-12', age_type: 'month' },
    { size: '12-18m', age: '12-18', age_type: 'month' },
    { size: '18-24m', age: '18-24', age_type: 'month' },
  ],
  default: [
    { size: '2-3y', age: '2-3', age_type: 'year' },
    { size: '3-4y', age: '3-4', age_type: 'year' },
    { size: '5-6y', age: '5-6', age_type: 'year' },
    { size: '7-8y', age: '7-8', age_type: 'year' },
    { size: '9-10y', age: '9-10', age_type: 'year' },
    { size: '11-12y', age: '11-12', age_type: 'year' },
  ],
};

export function buildVariants(product) {
  const sizes = SIZES_BY_CATEGORY[product.category] || SIZES_BY_CATEGORY.default;
  const variants = [];
  let vid = product.id * 100;
  product.colors.forEach((color) => {
    sizes.forEach((s, i) => {
      // Pseudo-random but deterministic stock so some sizes show "low stock".
      const stock = (product.id * 7 + i * 3 + color.name.length * 2) % 11;
      variants.push({
        id: vid++,
        product_id: product.id,
        color: color.name,
        size: s.size,
        age: s.age,
        age_type: s.age_type,
        stock,
      });
    });
  });
  return variants;
}

export function getProducts() {
  return PRODUCTS.map((p) => ({
    ...p,
    image: p.images[0],
    variants: buildVariants(p),
    sizeGuide: SIZE_GUIDE_KIDS,
  }));
}

export function getProductBySlug(slug) {
  return getProducts().find((p) => p.slug === slug) || null;
}

export const SIZE_GUIDE = SIZE_GUIDE_KIDS;
