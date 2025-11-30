import '../globals.css'
import MainHeader from '@/components/home-component/MainHeader'
import Footer from '@/components/home-component/Footer'
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import TopHeader from '@/components/home-component/TopHeader';
import SearchBar from '@/components/header/SearchBar';

export const metadata = {
  title: 'Resin By Saidat',
  description: 'Your one-stop shop for exquisite resin art and crafts.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="site-main-header sticky top-0 z-50">
                <TopHeader />
                <MainHeader />
                <SearchBar />
              </div>
              <main>{children}</main>
              <div className="site-main-header">
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
