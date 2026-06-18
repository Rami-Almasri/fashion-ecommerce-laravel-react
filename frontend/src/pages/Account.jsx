import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Heart, LogOut, Package, MapPin, Settings, ShoppingBag, LayoutDashboard, ArrowRight } from 'lucide-react';
import Page from '../components/Page';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ORDERS = [
  { id: 'PM-204881', date: 'Jun 2, 2026', status: 'Delivered', total: 122.0, items: 3 },
  { id: 'PM-198322', date: 'May 18, 2026', status: 'Delivered', total: 48.0, items: 1 },
  { id: 'PM-187110', date: 'Apr 29, 2026', status: 'Delivered', total: 86.0, items: 2 },
];

export default function Account() {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { count: wishCount } = useWishlist();
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    push('Signed out');
    navigate('/');
  };

  const firstName = (user?.name || 'there').split(' ')[0];

  return (
    <Page>
      <div className="container-px py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-eyebrow">My account</p>
            <h1 className="mt-2 text-4xl text-ink lg:text-5xl">Hi, {firstName} 👋</h1>
            <p className="mt-2 text-ink/55">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        {/* Staff dashboard banner */}
        {isStaff && (
          <Link
            to="/dashboard"
            className="group mt-8 flex items-center justify-between gap-4 rounded-3xl bg-ink p-6 text-cream transition hover:bg-clay-700"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/10">
                <LayoutDashboard size={22} />
              </span>
              <div>
                <p className="font-serif text-xl">Admin dashboard</p>
                <p className="text-sm text-cream/60">Sales, best customers, staff & branch performance</p>
              </div>
            </div>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {/* Stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Package, label: 'Orders', value: ORDERS.length, to: null },
            { icon: Heart, label: 'Wishlist', value: wishCount, to: '/wishlist' },
            { icon: ShoppingBag, label: 'Loyalty points', value: 240, to: null },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-3xl bg-sand p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-clay-500">
                <c.icon size={22} />
              </span>
              <div>
                <p className="font-serif text-2xl">{c.value}</p>
                {c.to ? (
                  <Link to={c.to} className="text-sm text-ink/55 hover:text-ink">{c.label} →</Link>
                ) : (
                  <p className="text-sm text-ink/55">{c.label}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-serif text-2xl">Order history</h2>
            <div className="mt-5 overflow-hidden rounded-3xl border border-ink/10">
              {ORDERS.map((o, i) => (
                <div key={o.id} className={`flex flex-wrap items-center justify-between gap-3 p-5 ${i % 2 ? 'bg-sand/50' : 'bg-cream'}`}>
                  <div>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-sm text-ink/50">{o.date} · {o.items} items</p>
                  </div>
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">{o.status}</span>
                  <p className="font-semibold">${o.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl">Details</h2>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">
                <MapPin size={18} className="text-clay-500" />
                <div>
                  <p className="text-sm font-medium">Shipping address</p>
                  <p className="text-xs text-ink/50">Add a default address</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">
                <Settings size={18} className="text-clay-500" />
                <div>
                  <p className="text-sm font-medium">Preferences</p>
                  <p className="text-xs text-ink/50">Notifications & privacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
