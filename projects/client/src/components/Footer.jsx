import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-10 pb-6 border-t border-gray-100">
            {/* Features Section */}
            <div className="container-responsive mb-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800">Free Shipping</h3>
                            <p className="text-xs text-gray-500">For all Orders Over $100</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800">30 Days Returns</h3>
                            <p className="text-xs text-gray-500">For an Exchange Product</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800">Secured Payment</h3>
                            <p className="text-xs text-gray-500">Payment Cards Accepted</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M21 11.25v-2.625c0-1.656-1.344-3-3-3h-2.625m-6.375 0H4.5c-1.656 0-3 1.344-3 3v2.625m19.5 0h-19.5m19.5 0c.828 0 1.5.672 1.5 1.5m-21-1.5c-.828 0-1.5.672-1.5 1.5m11.25-6.75h1.5m-1.5 3h1.5" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800">Special Gifts</h3>
                            <p className="text-xs text-gray-500">Our First Product Order</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-800">Support 24/7</h3>
                            <p className="text-xs text-gray-500">Contact us Anytime</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="container-responsive grid md:grid-cols-4 gap-8 py-10 border-t border-gray-100">
                {/* Contact Us */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
                    <div className="text-sm text-gray-500 space-y-3">
                        <p>FreshFarm - Premium Farm Store<br />507-Union Trade Centre France</p>
                        <p className="hover:text-primary transition-colors cursor-pointer">someone@example.com</p>
                        <p className="text-lg font-bold text-secondary">(+91) 9876543210</p>
                        <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                            </svg>
                            <span>Online Chat<br /><span className="text-xs">Get Expert Help</span></span>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Products</h3>
                    <ul className="text-sm text-gray-500 space-y-2">
                        {['Prices drop', 'New products', 'Best sales', 'Contact us', 'Sitemap', 'Stores'].map((item) => (
                            <li key={item}>
                                <Link to="/" className="hover:text-primary transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Our Company */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Our Company</h3>
                    <ul className="text-sm text-gray-500 space-y-2">
                        {['Delivery', 'Legal Notice', 'Terms and conditions of use', 'About us', 'Secure payment', 'Login'].map((item) => (
                            <li key={item}>
                                <Link to="/" className="hover:text-primary transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Subscribe to newsletter</h3>
                    <p className="text-sm text-gray-500">
                        Subscribe to our latest newsletter to get news about special discounts.
                    </p>
                    <div className="space-y-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary text-sm"
                        />
                        <button className="bg-secondary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-600 transition-colors uppercase tracking-wide">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container-responsive mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                <p>© {new Date().getFullYear()} FreshFarm. All rights reserved.</p>
                <div className="flex gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
