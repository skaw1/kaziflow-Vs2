

import React, { useState } from 'react';
import { useTheme } from '../context/AppContext';
import { SunIcon, MoonIcon, Icon } from '../constants';
import Footer from '../components/Footer';
import { allUsers } from '../data/users';
import { UserCategory } from '../types';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { theme, setTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeDemoTab, setActiveDemoTab] = useState<'admin' | 'user'>('admin');


    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleDemoSelect = (category: UserCategory, secondary: boolean = false) => {
        const usersOfCategory = allUsers.filter(u => u.category === category);
        let foundUser = secondary ? (usersOfCategory[1] || usersOfCategory[0]) : usersOfCategory[0];
        
        // Special case for 'Client' to cycle through Brand, Business, Client
        if (category === 'Client') {
            foundUser = allUsers.find(u => u.category === 'Client') || allUsers.find(u => u.category === 'Brand') || allUsers.find(u => u.category === 'Business');
        }

        if (foundUser && foundUser.password) {
            setEmail(foundUser.email);
            setPassword(foundUser.password);
            setError('');
        } else {
            setEmail('');
            setPassword('');
            setError(`Demo user for category "${category}" not found.`);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        const success = await onLogin(email, password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
            setIsLoading(false);
        }
        // On success, the main App component will handle navigation
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-primary text-white' : 'bg-light-primary text-black'}`}>
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-full bg-dark-secondary/50 dark:bg-light-secondary/10 hover:bg-dark-secondary dark:hover:bg-light-secondary/20 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="w-full max-w-md p-8 space-y-6 bg-light-secondary dark:bg-dark-secondary rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-brand-teal">Kazi Flow</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Your team's command center.</p>
                </div>
                
                {/* Demo Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Experience a Live Demo</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Click a role to autofill credentials and explore.</p>

                    <div className="flex bg-gray-200 dark:bg-dark-primary p-1 rounded-lg mb-4">
                        <button 
                            onClick={() => setActiveDemoTab('admin')} 
                            className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeDemoTab === 'admin' ? 'bg-white dark:bg-dark-secondary text-brand-teal shadow-sm' : 'text-gray-500 hover:bg-gray-300/50'}`}>
                            Admin View
                        </button>
                        <button 
                            onClick={() => setActiveDemoTab('user')} 
                            className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeDemoTab === 'user' ? 'bg-white dark:bg-dark-secondary text-brand-teal shadow-sm' : 'text-gray-500 hover:bg-gray-300/50'}`}>
                            User View
                        </button>
                    </div>
                    
                    {activeDemoTab === 'admin' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button onClick={() => handleDemoSelect('Primary Admin')} className="w-full text-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-teal/80 hover:bg-brand-teal/90">Primary Admin</button>
                            <button onClick={() => handleDemoSelect('Primary Admin', true)} className="w-full text-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-teal/80 hover:bg-brand-teal/90">Secondary Admin</button>
                        </div>
                    )}
                    
                     {activeDemoTab === 'user' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button onClick={() => handleDemoSelect('Team Member')} className="w-full text-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-primary">Team Member</button>
                            <button onClick={() => handleDemoSelect('Client')} className="w-full text-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-primary">Client</button>
                        </div>
                    )}
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-primary text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-primary text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-teal focus:border-brand-teal sm:text-sm"
                            placeholder="your password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal transition-all disabled:bg-opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign in'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};