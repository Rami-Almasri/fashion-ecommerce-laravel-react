import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import Page from '../components/Page';

export default function NotFound() {
  return (
    <Page>
      <div className="container-px flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-serif text-[7rem] leading-none text-clay-300 sm:text-[10rem]">404</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">This page wandered off</h1>
        <p className="mt-3 max-w-sm text-ink/55">
          Even the best explorers take a wrong turn. Let's get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary"><Home size={17} /> Home</Link>
          <Link to="/shop" className="btn-secondary"><ShoppingBag size={17} /> Shop</Link>
        </div>
      </div>
    </Page>
  );
}
