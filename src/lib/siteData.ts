import type { Coupon } from '@/types';

export const BRAND = {
  name: 'VÉRONA',
  full: 'VÉRONA Footwear',
  tagline: 'Step Into Your Style',
  email: 'care@verona.pk',
  phone: '0341083957',
  address: 'Liberty Market, Gulberg III, Lahore, Punjab 54660',
  whatsapp: '+92341083957',
};

export const COUPONS: Coupon[] = [
  { code: 'VERONA10', type: 'percent', value: 10, label: '10% OFF your order', minOrder: 2000 },
  { code: 'STEP500', type: 'flat', value: 500, label: '₨500 OFF your order', minOrder: 3000 },
];

export const FREE_DELIVERY_THRESHOLD = 5000;
export const DELIVERY_FLAT = 250;

export const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 'Gujranwala', 'Bahawalpur',
  'Sargodha', 'Sukkur', 'Larkana', 'Mardan', 'Mingora', 'Gujrat', 'Sahiwal',
  'Rahim Yar Khan', 'Jhelum', 'Dera Ghazi Khan', 'Abbottabad', 'Muzaffarabad',
];

export const PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Islamabad Capital Territory', 'Azad Jammu & Kashmir',
];

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay with cash when your order arrives at your doorstep.', icon: 'banknote' },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Pay instantly via your Easypaisa mobile account.', icon: 'smartphone' },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Pay securely through your JazzCash wallet.', icon: 'smartphone' },
  { id: 'bank', label: 'Bank Transfer', desc: 'Transfer the order amount to our bank account.', icon: 'building' },
  { id: 'card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard and UnionPay accepted.', icon: 'credit-card' },
] as const;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Men', to: '/men' },
  { label: 'Women', to: '/women' },
  { label: 'Kids', to: '/kids' },
  { label: 'Sneakers', to: '/sneakers' },
  { label: 'Formal', to: '/formal' },
  { label: 'Sports', to: '/sports' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const CATEGORIES = [
  { id: 'men', label: 'Men', to: '/men', desc: 'Craftsmanship for the modern gentleman' },
  { id: 'women', label: 'Women', to: '/women', desc: 'Elegance in every step' },
  { id: 'kids', label: 'Kids', to: '/kids', desc: 'Comfort that keeps up with them' },
  { id: 'sneakers', label: 'Sneakers', to: '/sneakers', desc: 'Street-ready all day comfort' },
  { id: 'formal', label: 'Formal', to: '/formal', desc: 'Boardroom to ballroom polish' },
  { id: 'sports', label: 'Sports', to: '/sports', desc: 'Performance built for Pakistan' },
];
