import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Users, Lock, ChevronRight, XCircle, Eye, EyeOff, Cpu } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
    const { login, staff } = useAppContext();
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [showStaffPrompt, setShowStaffPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [staffNumber, setStaffNumber] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleOwnerClick = () => {
        setShowPasswordPrompt(true);
        setShowStaffPrompt(false);
        setError('');
    };

    const handleStaffClick = () => {
        setShowStaffPrompt(true);
        setShowPasswordPrompt(false);
        setError('');
    };

    const handleCancelPrompt = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPasswordPrompt(false);
        setShowStaffPrompt(false);
        setPassword('');
        setStaffNumber('');
        setError('');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            login('owner');
        } else {
            setError('Incorrect password');
        }
    };

    const handleStaffSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const existingStaff = staff.find(s => s.staffNumber === staffNumber);

        if (existingStaff) {
            login('staff');
        } else {
            setError('Invalid Staff Number');
        }
    };

    return (
        <div className="login-container">
            {/* Animated Background Blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="login-panel glass-panel animate-fade-in relative z-10">
                <div className="mb-8 text-center pt-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-purple-600 mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(14,165,233,0.3)] border border-white/10">
                        <Cpu size={36} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-1">OSIL Technology Business Portal</h1>
                    <p className="text-secondary text-sm">Select your authorization level</p>
                </div>

                <div className="roles-grid">
                    {/* Owner Card with Flip/Overlay Logic */}
                    <div className={`role-card-wrapper ${showPasswordPrompt ? 'active' : ''}`}>
                        {!showPasswordPrompt ? (
                            <button
                                className={`role-card glass-panel group ${showStaffPrompt ? 'dimmed' : ''}`}
                                onClick={handleOwnerClick}
                            >
                                <div className="role-icon bg-blue transition-fast group-hover:scale-110">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-bold">Owner Access</h3>
                                <p className="text-sm">Full administrative access to Dashboard, Sales, and completely unlocked Inventory control.</p>
                            </button>
                        ) : (
                            <div className="role-card glass-panel password-card animate-fade-in">
                                <div className="password-header">
                                    <div className="flex items-center gap-2 mb-4 text-accent-blue">
                                        <Lock size={20} />
                                        <h3 className="font-bold">Admin Verification</h3>
                                    </div>
                                    <button
                                        className="cancel-btn hover:text-danger transition-fast"
                                        onClick={handleCancelPrompt}
                                        title="Cancel"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="password-form">
                                    <div className="form-group mb-1 relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Owner Password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError('');
                                            }}
                                            autoFocus
                                            className={error ? 'input-error w-full pr-10' : 'w-full pr-10'}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {error && <p className="text-danger text-xs mb-3">{error}</p>}
                                    {!error && <div className="spacer-sm mb-3"></div>}

                                    <button type="submit" className="btn-primary w-full">
                                        Unlock Portal <ChevronRight size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Staff Card Layered overlay */}
                    <div className={`role-card-wrapper ${showStaffPrompt ? 'active' : ''}`}>
                        {!showStaffPrompt ? (
                            <button
                                className={`role-card glass-panel group ${showPasswordPrompt ? 'dimmed' : ''}`}
                                onClick={handleStaffClick}
                            >
                                <div className="role-icon bg-orange transition-fast group-hover:scale-110">
                                    <Users size={24} />
                                </div>
                                <h3 className="font-bold">Staff Access</h3>
                                <p className="text-sm">Restricted utility access. Requires a valid 5-digit Staff Number to clock in.</p>
                            </button>
                        ) : (
                            <div className="role-card glass-panel password-card animate-fade-in relative">
                                {/* Orange highlight effect just for staff card */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-warning rounded-t-lg"></div>
                                <div className="password-header">
                                    <div className="flex items-center gap-2 mb-4 text-warning">
                                        <Users size={20} />
                                        <h3 className="font-bold">Employee Login</h3>
                                    </div>
                                    <button
                                        className="cancel-btn hover:text-danger transition-fast"
                                        onClick={handleCancelPrompt}
                                        title="Cancel"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleStaffSubmit} className="password-form">
                                    <div className="form-group mb-1">
                                        <input
                                            type="text"
                                            placeholder="Enter 5-digit Staff Number"
                                            value={staffNumber}
                                            onChange={(e) => {
                                                setStaffNumber(e.target.value);
                                                setError('');
                                            }}
                                            autoFocus
                                            maxLength={5}
                                            className={error ? 'input-error focus:border-warning' : 'focus:border-warning text-center tracking-[0.5em] text-lg font-mono'}
                                        />
                                    </div>
                                    {error && <p className="text-danger text-xs mb-3 text-center">{error}</p>}
                                    {!error && <div className="spacer-sm mb-3"></div>}

                                    <button
                                        type="submit"
                                        className="btn-primary w-full shadow-md"
                                        style={{ backgroundColor: 'var(--warning)' }}
                                    >
                                        Clock In <ChevronRight size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div >

                <p className="text-xs text-muted text-center mt-8">
                    Note: Demo mode logic uses default hardcoded passwords and PINs for simulation.
                </p>
            </div >
        </div >
    );
};
