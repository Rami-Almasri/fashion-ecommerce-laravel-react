import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import Page from '../components/Page';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useCatalog';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { products } = useProducts();
  const { ids, clear } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <Page>
      <div className="container-px py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-ink lg:text-5xl">Wishlist</h1>
            <p className="mt-2 text-ink/55">{saved.length} {saved.length === 1 ? 'piece' : 'pieces'} saved for later</p>
          </div>
          {saved.length > 0 && (
            <button onClick={clear} className="text-sm text-clay-600 underline-offset-2 hover:underline">Clear wishlist</button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl bg-sand py-24 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
              <Heart size={32} className="text-clay-400" />
            </span>
            <h2 className="mt-6 font-serif text-2xl">No favourites yet</h2>
            <p className="mt-2 max-w-sm text-ink/55">Tap the heart on anything you love to keep it here for later.</p>
            <Link to="/shop" className="btn-primary mt-7">Explore the shop <ArrowRight size={17} /></Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {saved.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
