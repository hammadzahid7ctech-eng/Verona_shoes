import { StoreProvider, useStore } from '@/lib/store';
import { parseRoute } from '@/components/Link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/Toaster';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { PRODUCTS } from '@/lib/products';

function Router() {
  const { route } = useStore();
  const { path, params } = parseRoute(route);

  let page;
  switch (path) {
    case '/':
      page = <HomePage />;
      break;
    case '/shop':
      page = <ShopPage title="All Shoes" subtitle="Explore our full collection of premium footwear crafted for Pakistan." image={PRODUCTS[0].image} />;
      break;
    case '/men':
      page = <ShopPage scope="gender" scopeValue="men" title="Men's Shoes" subtitle="Craftsmanship for the modern gentleman — formals, sneakers, boots and more." image={PRODUCTS.find((p) => p.gender === 'men')!.image} />;
      break;
    case '/women':
      page = <ShopPage scope="gender" scopeValue="women" title="Women's Shoes" subtitle="Elegance in every step — heels, flats, sneakers and sandals." image={PRODUCTS.find((p) => p.gender === 'women')!.image} />;
      break;
    case '/kids':
      page = <ShopPage scope="gender" scopeValue="kids" title="Kids' Shoes" subtitle="Comfort that keeps up with them — school, play and party ready." image={PRODUCTS.find((p) => p.gender === 'kids')!.image} />;
      break;
    case '/sneakers':
      page = <ShopPage scope="category" scopeValue="sneakers" title="Sneakers" subtitle="Street-ready, all-day comfort for every age." image={PRODUCTS.find((p) => p.category === 'sneakers')!.image} />;
      break;
    case '/formal':
      page = <ShopPage scope="category" scopeValue="formal" title="Formal Shoes" subtitle="Boardroom to ballroom — polished pairs for every occasion." image={PRODUCTS.find((p) => p.category === 'formal')!.image} />;
      break;
    case '/sports':
      page = <ShopPage scope="category" scopeValue="sports" title="Sports Shoes" subtitle="Performance built for Pakistan — running, training, trail and court." image={PRODUCTS.find((p) => p.category === 'sports')!.image} />;
      break;
    case '/product':
      page = <ProductDetailPage productId={params.id} />;
      break;
    case '/cart':
      page = <CartPage />;
      break;
    case '/wishlist':
      page = <WishlistPage />;
      break;
    case '/checkout':
      page = <CheckoutPage />;
      break;
    case '/orders':
      page = <OrdersPage />;
      break;
    case '/order':
      page = <OrderDetailPage orderId={params.id} />;
      break;
    case '/about':
      page = <AboutPage />;
      break;
    case '/contact':
      page = <ContactPage />;
      break;
    default:
      page = <NotFound />;
  }

  return <main className="min-h-[60vh] animate-fadeIn" key={path + (params.id ?? '')}>{page}</main>;
}

function NotFound() {
  const { navigate } = useStore();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center lg:px-8">
      <p className="font-display text-7xl font-bold text-gold-400">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink-950">Page not found</h1>
      <p className="mt-3 text-ink-600">The page you're looking for doesn't exist or has moved.</p>
      <button onClick={() => navigate('/')} className="btn btn-primary mt-8 px-8 py-3.5">Back to Home</button>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <Router />
        <Footer />
        <Toaster />
      </div>
    </StoreProvider>
  );
}

export default App;
