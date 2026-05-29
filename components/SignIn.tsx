import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Lock, Mail, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { auth } from '../firebase';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

interface SignInProps {
    onSignIn: () => void;
    role: 'buyer' | 'seller';
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, role }) => {
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [isSignUp, setIsSignUp] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMockLogin, setShowMockLogin] = useState(false);

    useEffect(() => {
        try {
            if (!window.recaptchaVerifier && authMethod === 'phone') {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
                  'size': 'invisible'
                });
            }
        } catch(e) {
            console.error("Recaptcha config error", e);
        }
        return () => {
            if(window.recaptchaVerifier){
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    }, [authMethod]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            onSignIn(); // Proceed to app
        } catch (err: any) {
            setError(err.message);
            if (err.code === 'auth/operation-not-allowed') setShowMockLogin(true);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, provider);
            onSignIn(); // Proceed to app
        } catch (err: any) {
            setError(err.message);
            if (err.code === 'auth/operation-not-allowed') setShowMockLogin(true);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!confirmationResult) {
                // Send OTP
                const appVerifier = window.recaptchaVerifier;
                const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
                setConfirmationResult(result);
            } else {
                // Verify OTP
                await confirmationResult.confirm(otp);
                onSignIn(); // Proceed to app
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error occurred during phone auth.');
            // Reset recaptcha on error
            if(window.recaptchaVerifier){
                window.recaptchaVerifier.render().then((widgetId: any) => {
                  (window as any).grecaptcha.reset(widgetId);
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background animated elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-bg-dark border border-white/10 shadow-2xl rounded-3xl p-8 md:p-10 space-y-6 glass-panel relative z-10"
            >
                <div className="text-center relative">
                    <div className="w-20 h-20 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/30 mb-6 shadow-[0_0_30px_rgba(255,107,0,0.2)]">
                        <Fingerprint size={36} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                    </div>
                    <h2 className="mt-2 text-3xl font-black text-white font-display tracking-tight">
                        Identity Verification
                    </h2>
                    <p className="mt-3 text-sm text-text-secondary">
                        Authenticate to access the high-end {role === 'buyer' ? 'consumer' : 'merchant'} exchange.
                    </p>
                </div>
                
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-sm text-center">
                        <p>{error}</p>
                        {showMockLogin && (
                            <button
                                onClick={onSignIn}
                                className="mt-2 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                                Provider not configured in Firebase? Continue in Demo Mode instead
                            </button>
                        )}
                    </div>
                )}

                <div className="flex gap-2 p-1 bg-bg-darker rounded-xl border border-white/5">
                    <button 
                        onClick={() => { setAuthMethod('email'); setError(''); setConfirmationResult(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMethod === 'email' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                    >
                        Email
                    </button>
                    <button 
                        onClick={() => { setAuthMethod('phone'); setError(''); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${authMethod === 'phone' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                    >
                        Phone
                    </button>
                </div>

                {authMethod === 'email' ? (
                    <form className="space-y-6" onSubmit={handleEmailAuth}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <label htmlFor="email-address" className="sr-only">Email access code</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input 
                                    id="email-address" 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner" 
                                    placeholder="Secure Email Address" 
                                />
                            </div>
                            <div className="relative group">
                                <label htmlFor="password" className="sr-only">Passphrase</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input 
                                    id="password" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner" 
                                    placeholder="Cryptographic Passphrase" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] glow-orange disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-brand-primary)' }}
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Authorization' : 'Authorize Access')}
                                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        <div className="text-center">
                            <button 
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs text-text-muted font-bold hover:text-white transition-colors"
                            >
                                {isSignUp ? 'Already have an authorization? Sign in.' : 'Request new authorization? Sign up.'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handlePhoneAuth}>
                        <div className="space-y-4">
                            {!confirmationResult ? (
                                <div className="relative group">
                                    <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input 
                                        id="phone-number" 
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required 
                                        className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner" 
                                        placeholder="+1 555 123 4567" 
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <label htmlFor="otp-code" className="sr-only">One-Time Password</label>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MessageSquare size={18} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input 
                                        id="otp-code" 
                                        type="text" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required 
                                        className="block w-full pl-11 pr-3 py-4 bg-bg-darker border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all sm:text-sm shadow-inner tracking-widest font-mono" 
                                        placeholder="000000" 
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <button 
                                id="sign-in-button"
                                type="submit" 
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] glow-orange disabled:opacity-50"
                                style={{ backgroundColor: 'var(--color-brand-primary)' }}
                            >
                                {loading ? 'Processing...' : (!confirmationResult ? 'Send Verification Code' : 'Verify Code')}
                                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                )}

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-bg-dark text-text-muted text-xs uppercase tracking-widest font-bold">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button 
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white text-sm font-bold transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>
                    
                <div className="text-center mt-6">
                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold">
                        Secured by Zero-Knowledge Architecture
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

