import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, ShoppingBag, Users, Crown, Store, BadgeDollarSign,
  Trophy, Lock, Loader2, ArrowUpRight,
} from 'lucide-react';
import Page from '../components/Page';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { formatPrice, cn } from '../lib/utils';

const MONTH_LABEL = (m) => {
  const [, mm] = m.split('-');
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(mm) - 1] || m;
};

const medal = ['bg-mustard text-ink', 'bg-clay-200 text-ink', 'bg-clay-100 text-ink'];

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-3xl bg-white/70 p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-full', accent)}>
          <Icon size={20} />
        </span>
        {sub && <span className="text-xs font-medium text-ink/40">{sub}</span>}
      </div>
      <p className="mt-4 font-serif text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/55">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, isStaff, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | denied | error

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    let alive = true;
    api
      .getDashboard()
      .then((d) => {
        if (!alive) return;
        setData(d);
        setState('ok');
      })
      .catch((e) => {
        if (!alive) return;
        setState(e?.response?.status === 403 ? 'denied' : 'error');
      });
    return () => {
      alive = false;
    };
  }, [isAuthenticated, navigate]);

  if (state === 'loading') {
    return (
      <Page>
        <div className="container-px flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-clay-500" size={32} />
        </div>
      </Page>
    );
  }

  if (state === 'denied' || (!isStaff && state !== 'ok')) {
    return (
      <Page>
        <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
            <Lock size={30} className="text-ink/40" />
          </span>
          <h1 className="mt-6 font-serif text-3xl">Staff access only</h1>
          <p className="mt-3 max-w-md text-ink/55">
            The analytics dashboard is available to admin and manager accounts. Sign in with{' '}
            <span className="font-medium text-ink">test@example.com</span> / <span className="font-medium text-ink">password</span> to explore it.
          </p>
          <Link to="/" className="btn-primary mt-7">Back home</Link>
        </div>
      </Page>
    );
  }

  if (state === 'error' || !data) {
    return (
      <Page>
        <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="font-serif text-3xl">Couldn't load analytics</h1>
          <p className="mt-3 max-w-md text-ink/55">Make sure the API is running on <code>http://localhost:8000</code>.</p>
        </div>
      </Page>
    );
  }

  const { overview, topCustomers, employeeSales, branchPerformance, salesByMonth, recentOrders } = data;
  const maxMonth = Math.max(...salesByMonth.map((m) => m.revenue), 1);
  const maxBranch = Math.max(...branchPerformance.map((b) => b.revenue), 1);
  const maxEmp = Math.max(...employeeSales.map((e) => e.total_sold), 1);

  return (
    <Page>
      <div className="container-px py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-eyebrow">Admin · {user?.name}</p>
            <h1 className="mt-2 text-4xl text-ink lg:text-5xl">Dashboard</h1>
            <p className="mt-2 text-ink/55">Sales performance across customers, staff and branches.</p>
          </div>
          <Link to="/account" className="btn-secondary">My account</Link>
        </div>

        {/* KPI cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={TrendingUp} label="Total revenue" value={formatPrice(overview.revenue)} accent="bg-sage-100 text-sage-600" />
          <StatCard icon={ShoppingBag} label="Orders" value={overview.orders} accent="bg-clay-100 text-clay-600" />
          <StatCard icon={Users} label="Customers" value={overview.customers} accent="bg-blush text-clay-700" />
          <StatCard icon={BadgeDollarSign} label="Avg order value" value={formatPrice(overview.avg_order_value)} accent="bg-sand text-ink" />
        </div>

        {/* Best customer highlight + sales chart */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-ink p-7 text-cream"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-clay-500/30 blur-2xl" />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/10">
              <Crown size={24} className="text-mustard" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">Best customer</p>
            <p className="mt-2 font-serif text-3xl">{overview.best_customer?.name}</p>
            <p className="mt-1 text-cream/60">{overview.best_customer?.email}</p>
            <div className="mt-5 flex gap-6">
              <div>
                <p className="font-serif text-2xl text-mustard">{formatPrice(overview.best_customer?.total_spent)}</p>
                <p className="text-xs text-cream/50">total spent</p>
              </div>
              <div>
                <p className="font-serif text-2xl">{overview.best_customer?.orders}</p>
                <p className="text-xs text-cream/50">orders</p>
              </div>
            </div>
          </motion.div>

          <div className="rounded-3xl bg-white/70 p-7 shadow-soft">
            <h2 className="font-serif text-xl">Revenue by month</h2>
            <div className="mt-6 flex h-44 items-stretch gap-3">
              {salesByMonth.map((m) => (
                <div key={m.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[11px] font-medium text-ink/50 opacity-0 transition group-hover:opacity-100">
                    {formatPrice(m.revenue)}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, (m.revenue / maxMonth) * 100)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-clay-300 to-clay-500"
                  />
                  <span className="text-[11px] text-ink/45">{MONTH_LABEL(m.month)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top customers + Employee sales */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Top customers */}
          <div className="rounded-3xl bg-white/70 p-7 shadow-soft">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-mustard" />
              <h2 className="font-serif text-xl">Top customers</h2>
            </div>
            <p className="mt-1 text-sm text-ink/50">Ranked by lifetime spend</p>
            <ul className="mt-5 space-y-1">
              {topCustomers.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-sand/60">
                  <span className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold', medal[i] || 'bg-sand text-ink/50')}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{c.name}</p>
                    <p className="truncate text-xs text-ink/45">{c.orders} orders · avg {formatPrice(c.avg_order)}</p>
                  </div>
                  <p className="font-semibold text-ink">{formatPrice(c.total_spent)}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Employee sales */}
          <div className="rounded-3xl bg-white/70 p-7 shadow-soft">
            <div className="flex items-center gap-2">
              <BadgeDollarSign size={18} className="text-sage-600" />
              <h2 className="font-serif text-xl">Employee sales</h2>
            </div>
            <p className="mt-1 text-sm text-ink/50">In-store sales closed by staff</p>
            <ul className="mt-5 space-y-3">
              {employeeSales.map((e) => (
                <li key={e.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{e.name} <span className="text-ink/40">· {e.branch}</span></span>
                    <span className="font-semibold">{formatPrice(e.total_sold)}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-sand">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(e.total_sold / maxEmp) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-sage-500"
                    />
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink/40">{e.orders} sales · {e.position}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Branch performance */}
        <div className="mt-6 rounded-3xl bg-white/70 p-7 shadow-soft">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-clay-600" />
            <h2 className="font-serif text-xl">Branch performance</h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {branchPerformance.map((b) => (
              <div key={b.id} className="rounded-2xl bg-sand/60 p-5">
                <p className="font-serif text-lg">{b.name}</p>
                <p className="text-xs text-ink/45">{b.city}</p>
                <p className="mt-3 font-serif text-2xl text-clay-600">{formatPrice(b.revenue)}</p>
                <p className="text-xs text-ink/50">{b.orders} orders</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-clay-400" style={{ width: `${(b.revenue / maxBranch) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-white/70 shadow-soft">
          <div className="flex items-center justify-between p-7 pb-4">
            <h2 className="font-serif text-xl">Recent orders</h2>
            <ArrowUpRight size={18} className="text-ink/30" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-ink/10 bg-sand/40 text-xs uppercase tracking-wider text-ink/50">
                  <th className="px-7 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Staff / Branch</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-7 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.order_number} className="border-b border-ink/5 last:border-0">
                    <td className="px-7 py-3 font-medium">{o.order_number}</td>
                    <td className="px-4 py-3 text-ink/70">{o.customer}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium',
                        o.channel === 'in-store' ? 'bg-sage-100 text-sage-700' : 'bg-clay-100 text-clay-700')}>
                        {o.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{o.employee ? `${o.employee} · ${o.branch}` : (o.branch || '—')}</td>
                    <td className="px-4 py-3 text-ink/50">{o.placed_at}</td>
                    <td className="px-7 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
}
