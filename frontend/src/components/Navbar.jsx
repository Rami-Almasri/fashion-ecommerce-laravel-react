import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const NAV = [
  { label: 'Shop All', to: '/shop' },
  { label: 'Baby', to: '/shop/baby' },
  { label: 'Girls', to: '/shop/girls' },
  { label: 'Boys', to: '/shop/boys' },
  { label: 'Essentials', to: '/shop/essentials' },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery('');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled ? 'bg-cream/85 shadow-soft backdrop-blur-md' : 'bg-cream'
      )}
    >
      <nav className="container-px">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Left: mobile menu + nav */}
          <div className="flex flex-1 items-center gap-6">
            <button
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/shop'}
                    className={({ isActive }) =>
                      cn(
                        'link-underline text-sm font-medium tracking-wide text-ink/75 hover:text-ink',
                        isActive && 'text-ink after:w-full'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: logo */}
          <Link to="/" className="flex flex-col items-center leading-none">
            <span className="font-serif text-xl font-semibold tracking-[0.18em] text-ink sm:text-2xl">
              PETIT MONDE
            </span>
            <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.42em] text-clay-500">
              children's fashion
            </span>
          </Link>

          {/* Right: actions */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/80 transition hover:bg-sand hover:text-ink"
            >
              <Search size={19} />
            </button>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/80 transition hover:bg-sand hover:text-ink sm:flex"
            >
              <User size={19} />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/80 transition hover:bg-sand hover:text-ink"
            >
              <Heart size={19} />
              {wishCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay-500 px-1 text-[9px] font-bold text-cream">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/80 transition hover:bg-sand hover:text-ink"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-cream">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              onSubmit={submitSearch}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 border-t border-ink/10 py-4">
                <Search size={20} className="text-ink/40" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pajamas, dresses, the new collection…"
                  className="w-full bg-transparent text-base outline-none placeholder:text-ink/35"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={20} className="text-ink/50 hover:text-ink" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream p-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-semibold tracking-[0.16em]">PETIT MONDE</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-1">
                {NAV.map((item, idx) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + idx * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-ink/10 py-4 font-serif text-2xl text-ink"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary w-full"
                >
                  <User size={17} /> {isAuthenticated ? 'My account' : 'Sign in'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
