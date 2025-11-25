# E-Commerce Components Reference Guide

## Component Import Paths

```javascript
// Shop Component
import ShopComponent from '@/components/Shop/ShopComponent';

// Cart Component
import CartComponent from '@/components/Cart/CartComponent';

// Context Hooks
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// API Utilities
import { 
  getProducts, 
  getProductById, 
  formatPrice, 
  calculateDiscount,
  getAverageRating,
  getCategories,
  formatProductName 
} from '@/lib/productApi';
```

---

## ShopComponent API Reference

### Props
None - uses internal state and context

### State & Hooks
```javascript
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [priceRange, setPriceRange] = useState([0, 1000000]);
const [sortBy, setSortBy] = useState('newest');
const [showFilters, setShowFilters] = useState(false);
const [categories, setCategories] = useState([]);
const [currentPage, setCurrentPage] = useState(1);

const { addToCart } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
```

### Features
- Responsive grid layout (1/2/3 columns)
- Search functionality (name, SKU, description)
- Category filtering
- Price range slider
- Multiple sorting options
- Product pagination (12 items/page)
- Product cards with images, ratings, pricing
- Wishlist integration
- Add to cart functionality

### Filtering Logic
```javascript
// Search filter
searchQuery && product.name.toLowerCase().includes(searchQuery)

// Category filter
selectedCategory === product.category

// Price filter
price >= priceRange[0] && price <= priceRange[1]

// Sorting options
'newest'      → sort by createdAt descending
'price-low'   → sort by price ascending
'price-high'  → sort by price descending
'name-a-z'    → sort by name alphabetically
'rating'      → sort by average rating descending
```

---

## ProductDetailsComponent API Reference

### Props
```javascript
params: {
  id: string // Product ID from URL
}
```

### State & Hooks
```javascript
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
const [activeTab, setActiveTab] = useState('description');

const { addToCart, getCartQuantity } = useCart();
const { toggleWishlist, isInWishlist } = useWishlist();
const router = useRouter();
```

### Key Methods
```javascript
const handleAddToCart = () => {
  addToCart(product, quantity);
  alert(`${product.name} added to cart!`);
  setQuantity(1);
}

const handleBuyNow = () => {
  addToCart(product, quantity);
  router.push('/checkout');
}
```

### Features
- Product image gallery with thumbnails
- Dynamic pricing display
- Quantity selector with limits
- Add to cart and buy now buttons
- Wishlist toggle
- Tabbed content (description, specs, reviews)
- Trust badges
- Breadcrumb navigation
- Stock status display
- Discount percentage display

---

## CartComponent API Reference

### Props
None - uses CartContext

### Hooks
```javascript
const { 
  cart, 
  removeFromCart, 
  updateQuantity, 
  getCartTotal, 
  clearCart 
} = useCart();
```

### Features
- Display all cart items
- Item images, names, prices
- Quantity controls (increment/decrement)
- Remove individual items
- Calculate subtotal, tax, total
- Clear cart button
- Continue shopping link
- Order summary sidebar
- Empty cart state

### Calculations
```javascript
const itemTotal = item.price * item.quantity;
const cartSubtotal = cart.reduce((sum, item) => 
  sum + (item.salePrice || item.basePrice) * item.quantity, 0
);
const tax = cartSubtotal * 0.075; // 7.5%
const shipping = 0; // Free shipping
const grandTotal = cartSubtotal + tax;
```

---

## CheckoutComponent API Reference

### Props
None - uses CartContext and useRouter

### State
```javascript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
});

const [paymentMethod, setPaymentMethod] = useState('card');
const [loading, setLoading] = useState(false);
const [orderComplete, setOrderComplete] = useState(false);
```

### Key Methods
```javascript
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
}

const handleSubmitOrder = async (e) => {
  e.preventDefault();
  // Validate form
  // Create order object
  // Save to localStorage
  // Clear cart
  // Show confirmation
}
```

### Features
- Shipping form with validation
- Multiple payment method options
- Order summary with items
- Cost breakdown (subtotal, tax, shipping)
- Security message
- Form submission handling
- Order confirmation page
- Order number generation
- localStorage persistence

### Order Data Structure
```javascript
{
  customer: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  items: CartItem[],
  total: number,
  subtotal: number,
  tax: number,
  shipping: number,
  paymentMethod: 'card' | 'bank' | 'wallet',
  orderDate: ISO8601String
}
```

---

## WishlistComponent API Reference

### Props
None - uses WishlistContext

### Hooks
```javascript
const { wishlist, removeFromWishlist } = useWishlist();
const { addToCart } = useCart();
```

### Features
- Display all wishlist items
- 4-column responsive grid
- Product images with hover zoom
- Wishlist item count
- Remove from wishlist button
- Add to cart button
- View details button
- Empty wishlist state

---

## CartContext API Reference

### Provider Component
```javascript
<CartProvider>
  {children}
</CartProvider>
```

### useCart Hook
```javascript
const {
  cart: CartItem[],
  addToCart: (product: Product, quantity: number) => void,
  removeFromCart: (cartItemId: string) => void,
  updateQuantity: (cartItemId: string, quantity: number) => void,
  clearCart: () => void,
  getCartTotal: () => number,
  getCartItemCount: () => number,
  getCartQuantity: (productId: string) => number,
  isLoaded: boolean
} = useCart();
```

### CartItem Type
```typescript
interface CartItem extends Product {
  cartItemId: string;     // Unique cart item ID
  quantity: number;       // Item quantity
  [key: string]: any;    // Product fields
}
```

### Key Features
- Auto-save to localStorage
- Prevent duplicate items (increment qty instead)
- Quantity bounds checking (1 to stock limit)
- Real-time total calculation
- Load from localStorage on mount

---

## WishlistContext API Reference

### Provider Component
```javascript
<WishlistProvider>
  {children}
</WishlistProvider>
```

### useWishlist Hook
```javascript
const {
  wishlist: Product[],
  addToWishlist: (product: Product) => void,
  removeFromWishlist: (productId: string) => void,
  isInWishlist: (productId: string) => boolean,
  toggleWishlist: (product: Product) => void,
  clearWishlist: () => void,
  isLoaded: boolean
} = useWishlist();
```

### Key Features
- Auto-save to localStorage
- Prevent duplicate items
- Toggle functionality (add/remove)
- Load from localStorage on mount

---

## Product API Functions

### getProducts(filters)
```javascript
// Fetch multiple products with filters
const response = await getProducts({
  search?: string,        // Search term
  category?: string,      // Category name
  minPrice?: number,      // Min price filter
  maxPrice?: number,      // Max price filter
  sortBy?: string,        // Sort field
  page?: number,          // Page number
  limit?: number,         // Items per page
  status?: string         // 'published' | 'draft'
});

// Returns
{
  success: boolean,
  products: Product[],
  total: number,
  page: number,
  pages: number
}
```

### getProductById(id)
```javascript
// Fetch single product
const response = await getProductById('productId');

// Returns
{
  success: boolean,
  product: {
    _id: string,
    name: string,
    description: string,
    basePrice: number,
    salePrice?: number,
    images: { url: string, alt: string }[],
    category: string,
    brand?: string,
    sku: string,
    stock: number,
    reviews: Review[],
    attributes: Attribute[],
    weight?: Weight,
    dimensions?: Dimensions,
    deliveryLocations: DeliveryLocation[],
    ...otherFields
  }
}
```

### formatPrice(price)
```javascript
const formatted = formatPrice(5000);
// Returns: "₦5,000"
```

### calculateDiscount(basePrice, salePrice)
```javascript
const discount = calculateDiscount(10000, 8000);
// Returns: 20 (percentage)
```

### getAverageRating(reviews)
```javascript
const rating = getAverageRating(product.reviews);
// Returns: 4.5 (number out of 5)
```

### getCategories()
```javascript
const categories = await getCategories();
// Returns: string[] of category names
```

### formatProductName(name)
```javascript
const formatted = formatProductName('some-product-name');
// Returns: "Some Product Name"
```

---

## MainHeader Integration

### Updated Features
- Cart icon with count badge
- Wishlist icon with count badge
- Real-time count updates
- Link to `/cart` and `/wishlist`

### Implementation
```javascript
// Imports added
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// In component
const { getCartItemCount } = useCart();
const { wishlist } = useWishlist();

// Render
<Link href="/wishlist" className="relative p-2">
  <Heart size={24} />
  {wishlist.length > 0 && (
    <span>{wishlist.length}</span>
  )}
</Link>

<Link href="/cart" className="relative p-2">
  <ShoppingCart size={24} />
  {getCartItemCount() > 0 && (
    <span>{getCartItemCount()}</span>
  )}
</Link>
```

---

## Product Type Definition

```typescript
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  basePrice: number;
  salePrice?: number;
  discountPercent?: number;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  barcode?: string;
  
  images: {
    url: string;
    alt?: string;
  }[];
  
  attributes?: {
    name: string;
    value: string;
  }[];
  
  reviews?: {
    userId: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: Date;
  }[];
  
  deliveryLocations?: {
    locationId: string;
    locationName?: string;
    shippingCost: number;
    estimatedDays?: number;
  }[];
  
  weight?: {
    value: number;
    unit: string;
  };
  
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}
```

---

## Styling Classes Reference

### Color Utilities
- **Blue**: `bg-blue-600`, `text-blue-600`, `border-blue-200`
- **Green**: `bg-green-600`, `text-green-600`
- **Red**: `bg-red-500`, `text-red-600`
- **Yellow**: `text-yellow-400` (ratings)
- **Gray**: `bg-gray-50`, `text-gray-700`, `border-gray-300`

### Spacing Utilities
- **Padding**: `p-2`, `p-4`, `p-6`, `px-4`, `py-2`
- **Margin**: `m-4`, `mb-4`, `mt-2`
- **Gap**: `gap-2`, `gap-4`, `gap-6`, `space-x-3`, `space-y-4`

### Responsive Utilities
- **Grid**: `grid-cols-1`, `sm:grid-cols-2`, `lg:grid-cols-3`, `lg:grid-cols-4`
- **Display**: `hidden`, `md:flex`, `lg:hidden`
- **Width**: `w-full`, `lg:col-span-2`

### Interactive Utilities
- **Hover**: `hover:bg-gray-100`, `hover:text-blue-600`, `hover:shadow-xl`
- **Transitions**: `transition`, `duration-300`
- **Disabled**: `disabled:bg-gray-400`, `disabled:cursor-not-allowed`

### Layout Utilities
- **Flex**: `flex`, `flex-1`, `flex-col`, `items-center`, `justify-between`
- **Grid**: `grid`, `grid-cols-3`, `gap-4`
- **Position**: `relative`, `absolute`, `sticky`, `top-0`
- **Overflow**: `overflow-hidden`, `overflow-y-auto`

---

## Common Patterns

### Adding Item to Cart
```javascript
import { useCart } from '@/context/CartContext';

export function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  
  const handleClick = () => {
    addToCart(product, 1);
    alert('Added to cart!');
  };
  
  return (
    <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded">
      Add to Cart
    </button>
  );
}
```

### Toggling Wishlist
```javascript
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

export function WishlistButton({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  
  return (
    <button 
      onClick={() => toggleWishlist(product)}
      className={inWishlist ? 'text-red-500' : 'text-gray-500'}
    >
      <Heart fill={inWishlist ? 'currentColor' : 'none'} />
    </button>
  );
}
```

### Displaying Cart Count
```javascript
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { getCartItemCount } = useCart();
  const count = getCartItemCount();
  
  return (
    <div className="relative">
      <ShoppingCart size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white 
          text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}
```

### Formatting Price
```javascript
import { formatPrice } from '@/lib/productApi';

export function PriceDisplay({ basePrice, salePrice }) {
  return (
    <div>
      {salePrice && salePrice < basePrice ? (
        <>
          <span className="text-lg font-bold">{formatPrice(salePrice)}</span>
          <span className="text-sm line-through text-gray-500 ml-2">
            {formatPrice(basePrice)}
          </span>
        </>
      ) : (
        <span className="text-lg font-bold">{formatPrice(basePrice)}</span>
      )}
    </div>
  );
}
```

---

## Summary

This reference guide covers all components, contexts, utilities, and patterns used in the e-commerce system. Refer to specific sections for API details, examples, and implementation patterns.

For complete documentation, see `ECOMMERCE_SYSTEM_DOCUMENTATION.md`
