<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    private function img(string $id, int $w = 900): string
    {
        return "https://images.unsplash.com/{$id}?auto=format&fit=crop&w={$w}&q=80";
    }

    private function colors(array $names): array
    {
        $swatch = [
            'Ecru' => '#EFE7DA', 'Clay' => '#B86E48', 'Sage' => '#8AA26F', 'Sky' => '#A9C4D4',
            'Blush' => '#E7B7AE', 'Navy' => '#2E3A4B', 'Mustard' => '#D8A24A', 'Charcoal' => '#33312E',
            'Ivory' => '#F7F2E9', 'Rust' => '#A65A3A',
        ];

        return array_map(fn ($n) => ['name' => $n, 'hex' => $swatch[$n] ?? '#cccccc'], $names);
    }

    public function run(): void
    {
        $categories = Category::pluck('id', 'type'); // ['Baby' => 1, ...]

        $items = [
            ['coraline-floral-set', 'Coraline Floral Set', 'suit', 'Boys', 'summer', 48, 62, 4.8, 124, ['sale', 'bestseller'], ['photo-1502451885777-16c98b07834a', 'photo-1604303768345-038b79a8c47a'], ['Sage', 'Ecru'], ['Cotton poplin, 100% organic', 'Coconut shell buttons', 'Elastic waist shorts', 'Machine wash cold'], 'A breezy two-piece in a hand-drawn floral print — a soft collared shirt paired with matching pull-on shorts.'],
            ['marguerite-tee-shorts', 'Marguerite Tee & Shorts', 'shorts', 'Girls', 'summer', 36, null, 4.6, 88, ['new'], ['photo-1604482858862-1db908a653e4'], ['Ivory', 'Charcoal', 'Blush'], ['Combed cotton jersey', 'Pre-washed for softness', 'Roll-up cuffs', 'GOTS certified'], 'Monochrome made playful. A relaxed jersey tee tucked into crisp white shorts.'],
            ['breton-stripe-tee', 'Breton Stripe Tee', 't-shirt', 'Boys', 'summer', 28, null, 4.9, 213, ['bestseller'], ['photo-1627639679690-db4d401aae84', 'photo-1627639679608-993e305c1f2c', 'photo-1627639678221-db426a961ba1', 'photo-1627639678232-1d3bcbcc1042'], ['Navy', 'Clay', 'Sage'], ['260gsm cotton jersey', 'Yarn-dyed stripes', 'Ribbed crew neck', 'Made in Portugal'], 'The little sailor classic. Yarn-dyed stripes on a heavyweight jersey that only gets better with every wash.'],
            ['linen-button-shirt', 'Linen Button Shirt', 't-shirt', 'Boys', 'summer', 42, null, 4.7, 64, [], ['photo-1602863211758-e35574d21b22'], ['Sky', 'Rust', 'Ecru'], ['100% washed linen', 'Camp collar', 'Chest patch pocket', 'Naturally breathable'], 'A grown-up shirt scaled down. Washed linen with a soft camp collar and a relaxed fit.'],
            ['teddy-knit-sweater', 'Teddy Knit Sweater', 'sweater', 'Baby', 'winter', 54, null, 5.0, 156, ['bestseller'], ['photo-1703282581360-a3685b2d52ac'], ['Ecru', 'Clay', 'Mustard'], ['Extra-fine merino wool', 'Shoulder snap opening', 'Hypoallergenic', 'Hand wash recommended'], 'Cloud-soft merino knit with a roomy fit for layering over onesies.'],
            ['cloud-knit-cardigan', 'Cloud Knit Cardigan', 'sweater', 'Baby', 'winter', 46, null, 4.8, 97, ['new'], ['photo-1608093602519-ccd31f515f83'], ['Ivory', 'Sage'], ['Organic cotton blend', 'Shell buttons', 'Ribbed trims', 'Oeko-Tex certified'], 'An heirloom-worthy cardigan in a chunky cloud knit, finished with smooth shell buttons.'],
            ['pique-polo', 'Piqué Polo', 't-shirt', 'Boys', 'summer', 32, null, 4.5, 71, [], ['photo-1603792273674-543a44863980'], ['Sky', 'Navy', 'Ivory'], ['Cotton piqué', 'Tipped ribbed collar', 'Two-button placket', 'Machine washable'], 'A breathable piqué polo with a tipped collar — the smart-casual staple.'],
            ['dreamer-onesie', 'Dreamer Onesie', 'pajamas', 'Baby', 'winter', 34, null, 4.9, 188, ['bestseller'], ['photo-1711313532755-47fe78c65a50'], ['Ecru', 'Blush', 'Sky'], ['Brushed organic cotton', 'Two-way YKK zip', 'Fold-over cuffs', 'Tagless for comfort'], 'The softest sleep there is. A footed onesie in brushed organic cotton with fold-over mitts.'],
            ['little-gent-suit', 'Little Gent Suit', 'suit', 'Boys', 'winter', 89, 110, 4.7, 52, ['sale'], ['photo-1725147874938-7904e3362841'], ['Charcoal', 'Navy'], ['Wool-touch suiting', 'Adjustable waistcoat', 'Clip-on tie included', 'Dry clean'], 'For the occasions that matter. A tailored waistcoat, trousers and a finishing tie.'],
            ['heritage-plaid-shirt', 'Heritage Plaid Shirt', 't-shirt', 'Boys', 'winter', 38, null, 4.6, 43, [], ['photo-1604303768345-038b79a8c47a'], ['Rust', 'Navy', 'Sage'], ['Brushed cotton flannel', 'Curved hem', 'Corozo buttons', 'Machine wash warm'], 'A brushed flannel check that feels like a hug.'],
            ['camille-tiered-dress', 'Camille Tiered Dress', 'dress', 'Girls', 'summer', 58, null, 4.9, 167, ['bestseller', 'new'], ['photo-1695262620884-b1fdb55a631e'], ['Ivory', 'Blush', 'Mustard'], ['Cotton voile', 'Smocked stretch bodice', 'Lined skirt', 'Machine wash cold'], 'Twirl-tested and approved. Three airy tiers of cotton voile with a smocked bodice that grows with her.'],
            ['bluebell-puffer-jacket', 'Bluebell Puffer Jacket', 'jacket', 'Girls', 'winter', 74, null, 4.8, 119, ['bestseller'], ['photo-1695263747144-a52aa3739d62'], ['Sky', 'Blush', 'Sage'], ['Recycled polyester shell', 'Water-repellent finish', 'Fleece-lined pockets', 'Packable hood'], 'Lightweight warmth for frosty mornings. A water-repellent shell with recycled down-alternative fill.'],
            ['noir-tracksuit', 'Noir Track Set', 'hoodie', 'Boys', 'winter', 64, null, 4.7, 81, ['new'], ['photo-1758782213532-bbb5fd89885e'], ['Charcoal', 'Navy', 'Clay'], ['Heavyweight loopback cotton', 'Brushed inner', 'Tapered jogger fit', 'Ribbed cuffs'], 'Street-smart and stage-ready. A heavyweight loopback hoodie and tapered joggers in deep noir.'],
            ['rainbow-crew-tee', 'Rainbow Crew Tee', 't-shirt', 'Essentials', 'summer', 24, null, 4.8, 240, ['bestseller'], ['photo-1528145203756-0ed7f01ee120'], ['Mustard', 'Sage', 'Sky', 'Blush'], ['Organic cotton jersey', 'Set-in sleeves', 'Ribbed neckband', 'Pre-shrunk'], 'The one they will reach for every morning. A vivid multicolour crew in buttery organic jersey.'],
            ['sunday-hoodie-set', 'Sunday Hoodie Set', 'hoodie', 'Baby', 'winter', 44, null, 4.6, 58, [], ['flagged/photo-1555895312-fc2610acaeb3'], ['Ecru', 'Sage', 'Clay'], ['French terry cotton', 'Envelope neckline', 'Fold-over cuffs', 'Machine wash cold'], 'Lazy-morning softness in a French-terry hoodie and matching joggers.'],
            ['meadow-denim-shorts', 'Meadow Denim Shorts', 'shorts', 'Essentials', 'summer', 30, null, 4.5, 66, [], ['photo-1627639678232-1d3bcbcc1042'], ['Sky', 'Navy'], ['Stretch denim', 'Adjustable inner waistband', 'Five-pocket styling', 'Reinforced seams'], 'Proper little denim shorts with an adjustable waist and just-right length.'],
        ];

        $babySizes = [
            ['3-6m', '3-6', 'month'], ['6-12m', '6-12', 'month'],
            ['12-18m', '12-18', 'month'], ['18-24m', '18-24', 'month'],
        ];
        $kidSizes = [
            ['2-3y', '2-3', 'year'], ['3-4y', '3-4', 'year'], ['5-6y', '5-6', 'year'],
            ['7-8y', '7-8', 'year'], ['9-10y', '9-10', 'year'], ['11-12y', '11-12', 'year'],
        ];

        foreach ($items as $i => $it) {
            [$slug, $name, $type, $catType, $season, $price, $orig, $rating, $reviews, $badges, $images, $colorNames, $details, $desc] = $it;

            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $desc,
                    'type' => $type,
                    'category_id' => $categories[$catType] ?? $categories->first(),
                    'season' => $season,
                    'price' => $price,
                    'original_price' => $orig,
                    'rating' => $rating,
                    'reviews' => $reviews,
                    'badges' => $badges,
                    'images' => array_map(fn ($id) => $this->img($id), $images),
                    'colors' => $this->colors($colorNames),
                    'details' => $details,
                ]
            );

            // Generate colour x size variants with deterministic stock.
            $product->variants()->delete();
            $sizes = $catType === 'Baby' ? $babySizes : $kidSizes;
            foreach ($colorNames as $color) {
                foreach ($sizes as $si => [$size, $age, $ageType]) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color' => $color,
                        'size' => $size,
                        'age' => $age,
                        'age_type' => $ageType,
                        'stock' => (($i + 1) * 7 + $si * 3 + strlen($color) * 2) % 11,
                    ]);
                }
            }
        }
    }
}
