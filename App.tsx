import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.tsx';
import ProductCard from './components/ProductCard.tsx';
import Footer from './components/Footer.tsx';
import ProductGenerator from './components/ProductGenerator.tsx';
import { INITIAL_PRODUCTS } from './constants.ts';
import { Product, CartItem } from './types.ts';

// Type for the page view
type View = 'home' | 'cart' | 'checkout' | 'orderSuccess';

// Helper for currency formatting
const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format(price);


// =================================================================
// START: View Components (defined within App.tsx to avoid new files)
// =================================================================

const CartView = ({ cart, updateQuantity, removeFromCart, setView, getCartTotal }) => {
  if (cart.length === 0) {
    return (
      <div className="text-center my-24 py-16 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-secondary">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-4">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => setView('home')} className="mt-8 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
          Start Shopping
        </button>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const shippingFee = cartTotal > 500 ? 0 : 50;
  const totalAmount = cartTotal + shippingFee;

  return (
    <div className="my-12">
      <h1 className="text-4xl font-extrabold text-secondary tracking-tight mb-8">Your Shopping Cart</h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <section className="lg:col-span-7">
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {cart.map((item: CartItem) => (
              <li key={item.id} className="flex py-6">
                <div className="flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div>
                    <div className="flex justify-between font-bold text-secondary">
                      <h3>{item.name}</h3>
                      <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md" aria-label="Decrease quantity">-</button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md" aria-label="Increase quantity">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-red-500 hover:text-red-700">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="lg:col-span-5 mt-16 rounded-lg bg-gray-100 px-4 py-6 sm:p-6 lg:mt-0">
          <h2 className="text-lg font-medium text-secondary">Order summary</h2>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">{formatPrice(cartTotal)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600"><span>Shipping</span></dt>
              <dd className="text-sm font-medium text-gray-900">{shippingFee > 0 ? formatPrice(shippingFee) : 'FREE'}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-secondary">Order total</dt>
              <dd className="text-base font-medium text-secondary">{formatPrice(totalAmount)}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <button onClick={() => setView('checkout')} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300">Checkout</button>
          </div>
        </section>
      </div>
    </div>
  );
};


const CheckoutView = ({ cartTotal, setView, clearCart }) => {
    const shippingFee = cartTotal > 500 ? 0 : 50;
    const totalAmount = cartTotal + shippingFee;
    
    const [formState, setFormState] = useState({ name: '', address: '', city: '', pincode: '' });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({...prevState, [name]: value}));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Basic validation
        if(formState.name && formState.address && formState.city && formState.pincode) {
            clearCart();
            setView('orderSuccess');
        } else {
            alert('Please fill out all shipping details.');
        }
    };

    return (
        <div className="my-12">
            <h1 className="text-4xl font-extrabold text-secondary tracking-tight mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-secondary mb-6">Shipping Information</h2>
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" value={formState.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" name="address" id="address" value={formState.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" id="city" value={formState.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                            <input type="text" name="pincode" id="pincode" value={formState.pincode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                         <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 mt-6">
                            Place Order
                        </button>
                    </form>
                </div>
                 <div className="bg-gray-100 p-8 rounded-xl">
                    <h2 className="text-2xl font-bold text-secondary mb-6">Order Summary</h2>
                     <dl className="space-y-4">
                        <div className="flex items-center justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{formatPrice(cartTotal)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-gray-600">Shipping</dt><dd>{shippingFee > 0 ? formatPrice(shippingFee) : 'FREE'}</dd></div>
                        <div className="flex items-center justify-between text-lg font-bold text-secondary border-t border-gray-300 pt-4 mt-4"><dt>Total</dt><dd>{formatPrice(totalAmount)}</dd></div>
                    </dl>
                    <p className="text-xs text-gray-500 mt-8">This is a simulated checkout process. No real payment will be processed.</p>
                </div>
            </div>
        </div>
    );
};


const OrderSuccessView = ({ setView }) => {
    return (
        <div className="text-center my-24 py-16 bg-white rounded-xl shadow-lg">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
            <h1 className="text-4xl font-bold text-secondary mt-6">Order Placed Successfully!</h1>
            <p className="text-gray-500 mt-4">Thank you for your purchase. A confirmation has been (not really) sent to you.</p>
            <button onClick={() => setView('home')} className="mt-8 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                Continue Shopping
            </button>
      </div>
    );
};

// =================================================================
// END: View Components
// =================================================================


const App: React.FC = () => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [view, setView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
        console.error("Could not save cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const renderContent = () => {
    switch (view) {
      case 'cart':
        return <CartView cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} setView={setView} getCartTotal={getCartTotal} />;
      case 'checkout':
        return <CheckoutView cartTotal={getCartTotal()} setView={setView} clearCart={clearCart} />;
      case 'orderSuccess':
        return <OrderSuccessView setView={setView} />;
      case 'home':
      default:
        return (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-secondary tracking-tight lg:text-5xl">
                Curated For You
              </h1>
              <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
                Explore our handpicked collection of products from across India.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
            <ProductGenerator onAddToCart={addToCart} />
          </>
        );
    }
  };

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header cartCount={getCartItemCount()} onCartClick={() => setView('cart')} onLogoClick={() => setView('home')} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;