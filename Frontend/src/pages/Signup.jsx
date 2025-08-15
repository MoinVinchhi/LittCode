import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    emailId: z.string().email("Invalid email"),
    password: z.string().min(4, "Password should contain at least 4 characters")
});

function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(signupSchema) });

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data, event) => {
        // Prevent default form submission
        event?.preventDefault();
        
        // Client-side validation
        if (!data.firstName?.trim()) {
            if (window.popupManager) {
                window.popupManager.showValidationError('Please enter your first name');
            }
            return;
        }
        
        if (!data.emailId?.trim()) {
            if (window.popupManager) {
                window.popupManager.showValidationError('Please enter your email address');
            }
            return;
        }
        
        if (!data.password?.trim()) {
            if (window.popupManager) {
                window.popupManager.showValidationError('Please enter a password');
            }
            return;
        }

        if (data.password.length < 4) {
            if (window.popupManager) {
                window.popupManager.showValidationError('Password must be at least 4 characters long');
            }
            return;
        }

        const result = await dispatch(registerUser(data));
        
        if (registerUser.fulfilled.match(result)) {
            // Success is handled in authSlice with popup
            // Navigate only after successful registration
            setTimeout(() => navigate('/'), 1000);
        } else if (registerUser.rejected.match(result)) {
            // Error is already handled in authSlice with popup
            console.error('Registration failed:', result.payload?.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen flex justify-center items-center bg-base-200 p-4"
        >
            <div className="card w-full max-w-md p-8 bg-base-100 shadow-xl rounded-lg">
                <h1 className="text-5xl font-bold text-center mb-10 text-accent-content">LittCode</h1>

                {/* First Name */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text text-accent-content text-lg">First Name</span>
                    </label>
                    <input
                        {...register('firstName')}
                        type="text"
                        placeholder="John"
                        className={`input input-bordered w-full bg-base-200 text-accent-content placeholder-gray-500 border ${errors.firstName ? 'border-error' : 'border-gray-600'}`}
                    />
                    {errors.firstName && (
                        <label className="label">
                            <span className="label-text-alt text-error text-sm">{errors.firstName.message}</span>
                        </label>
                    )}
                </div>

                {/* Email */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text text-accent-content text-lg">Email</span>
                    </label>
                    <input
                        {...register('emailId')}
                        type="email"
                        placeholder="john@example.com"
                        className={`input input-bordered w-full bg-base-200 text-accent-content placeholder-gray-500 border ${errors.emailId ? 'border-error' : 'border-gray-600'}`}
                    />
                    {errors.emailId && (
                        <label className="label">
                            <span className="label-text-alt text-error text-sm">{errors.emailId.message}</span>
                        </label>
                    )}
                </div>

                {/* Password */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text text-accent-content text-lg">Password</span>
                    </label>
                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`input input-bordered w-full bg-base-200 text-accent-content placeholder-gray-500 border ${errors.password ? 'border-error' : 'border-gray-600'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent-content hover:cursor-pointer focus:outline-none"
                            aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                        >
                            {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 640 640">
                                        <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM208.9 175.1C241 156.2 278.1 144 320 144C385.2 144 438.8 173.6 479.9 211.7C518.4 247.4 545 290 558.5 320C544.9 350 518.3 392.5 479.9 428.3C476.8 431.1 473.7 433.9 470.5 436.7L425.8 392C439.8 371.5 448 346.7 448 320C448 249.3 390.7 192 320 192C293.3 192 268.5 200.2 248 214.2L208.9 175.1zM390.9 357.1L282.9 249.1C294 243.3 306.6 240 320 240C364.2 240 400 275.8 400 320C400 333.4 396.7 346 390.9 357.1zM135.4 237.2L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L384.2 486C364.2 492.4 342.8 496 320 496C254.8 496 201.2 466.4 160.1 428.3C121.6 392.6 95 350 81.5 320C91.9 296.9 110.1 266.4 135.5 237.2z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 640 640">
                                        <path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5z"/>
                                    </svg>
                                )}
                        </button>
                    </div>
                    {errors.password && (
                        <label className="label">
                            <span className="label-text-alt text-error text-sm">{errors.password.message}</span>
                        </label>
                    )}
                </div>



                {/* Submit */}
                <div className='flex flex-col items-center justify-center'>
                    <button
                        type="submit"
                        className={`btn btn-primary btn-wide text-lg ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? '' : 'Sign Up'}
                    </button>
                    <p className="text-accent-content text-base mt-4">
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:text-blue-400 cursor-pointer font-medium"
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </form>
    );
}

export default Signup;
