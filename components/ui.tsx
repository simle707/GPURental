'use client'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import React, { useEffect } from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: 'info' | 'success' | 'warning' | 'error';
	showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({ 
	children, 
	variant = 'info', 
	showIcon = true,
	className = '', 
	...props 
}) => {
	const styles = {
		info: "alert-info alert-soft",
		success: "alert-success alert-soft",
		warning: "alert-warning alert-soft",
		error: "alert-error alert-soft",
	};

	const icons = {
		info: <Info className="w-4 h-4" />,
		success: <CheckCircle2 className="w-4 h-4" />,
		warning: <TriangleAlert className="w-4 h-4" />,
		error: <AlertCircle className="w-4 h-4" />,
	};

	return (
		<div 
			className={`alert ${styles[variant]} alert-soft shadow-sm py-2 text-sm rounded-md ${className}`} 
			{...props}
		>
			{showIcon && icons[variant]}
			<span>{children}</span>
		</div>
	);
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'warning';
	size?: 'xs' | 'sm' | 'md' | 'lg';
	loading?: boolean;
	circle?: boolean;
	disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children, 
	variant = 'primary',
	size = 'md',
	loading = false,
	circle = false,
	className = '',
	disabled,
	...props 
}) => {  
	const variants = {
		primary: "btn-primary btn-soft",
		secondary: "btn-secondary btn-soft",
		outline: "btn-outline border-base-300",
		ghost: "btn-ghost",
		error: "btn-error btn-soft",
		success: "btn-success btn-soft",
		warning: "btn-warning btn-soft"
	};

	const sizes = { xs: "btn-xs", sm: "btn-sm", md: "btn-md", lg: "btn-lg" };

	return (
		<button 
			className={`btn ${variants[variant]} ${sizes[size]} ${className} ${circle ? 'btn-circle' : ''}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading && <span className="loading loading-spinner loading-xs"></span>}
			{children}
		</button>
	);
};

// --- Card ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
	<div className={`card bg-base-100 card-bordered shadow-sm ${className || ''}`} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
	<div className={`p-6 pb-2 ${className || ''}`} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
	<h3 className={`card-title text-2xl font-bold ${className || ''}`} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
	<div className={`card-body p-6 pt-2 ${className || ''}`} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
	<div className={`card-actions justify-end ${className || ''}`} {...props} />
);

// --- Badge ---
export const Badge: React.FC<{ 
	children: React.ReactNode, 
	variant?: 'default' | 'success' | 'warning' | 'error' | 'outline', 
	className?: string 
}> = ({ children, variant = 'default', className = '' }) => {
	const styles = {
		default: "badge-primary",
		success: "badge-success",
		warning: "badge-warning",
		error: "badge-error",
		outline: "badge-outline"
	};
	return (
		<div className={`badge font-bold py-3  ${styles[variant]} border-transparent ${className}`}>
			{children}
		</div>
	);
};

// --- Slider ---
export const Slider: React.FC<{ 
	value: number, 
	max: number, 
	onChange: (val: number) => void,
	disabled: boolean
	className?: string
}> = ({ value, max, onChange, disabled, className = '' }) => {
	// const showSteps = max > 1 && max <= 12;
	// const steps = showSteps ? Array.from({length: max}, (_, i) => i + 1) : []

	return (
		<div className={`${className}`}>
			<input 
				type="range" 
				min="1" 
				max={max} 
				value={value}
				step="1"
				onChange={(e) => onChange(parseInt(e.target.value))}
				disabled={disabled}
				className={`range range-primary range-sm w-full ${className}`}
			/>

			{/* {showSteps && (
				<div className='flex justify-between w-full px-2 mt-1'>
					{steps.map((step) => (
						<div key={step} className="flex flex-col items-center gap-1">
							<span className={`w-px h-1.5 ${value >= step ? 'bg-primary' : 'bg-base-300'}`} />
							<span className={`text-[10px] font-mono ${value === step ? 'text-primary font-bold' : 'opacity-40'}`}>
								{step}
							</span>
						</div>
					))}
				</div>
			)} */}
		</div>
		
		
	);
};

// --- Dialog ---
interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	confirmLoading: boolean
	variant?: 'primary' | 'error' | 'warning';
}

export const Dialog: React.FC<DialogProps> = ({
	isOpen,
	onClose,
	title,
	children,
	onConfirm,
	confirmLoading,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = 'primary'
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="card bg-base-100 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
				<div className="p-6">
					<h3 className="text-xl font-bold mb-2">{title}</h3>
					<div className="py-4 text-muted-foreground">
						{children}
					</div>
					<div className="flex justify-end gap-2 mt-4">
						<Button variant="ghost" onClick={onClose} disabled={confirmLoading}>
							{cancelText}
						</Button>
						<Button 
							variant={variant} 
							loading={confirmLoading} 
							onClick={onConfirm}
						>
							{confirmText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

// --- Toast Container ---
interface ToastProps {
	message: string,
	variant: 'success' | 'error' | 'info' | 'warning',
	onClose: () => void
}
export const Toast: React.FC<ToastProps> = ({
	message, variant = 'info', onClose 
}) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 5000)
		return () => clearTimeout(timer)
	}, [onClose])

	return (
		<div className="toast toast-top toast-center top-20 z-100 animate-in slide-in-from-top duration-300">
			<div className={`alert alert-${variant} shadow-lg py-3`}>
				<span>{message}</span>
			</div>
		</div>
	);
}

interface LoadingProps {
	variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
	size?: 'xs' | 'sm' | 'md' | 'lg';
	color?: string;
	className?: string;
	label?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
	variant = 'spinner', 
	size = 'md', 
	color = 'text-primary', 
	className = '',
	label
}) => {
	const sizeClass = {
		xs: 'loading-xs',
		sm: 'loading-sm',
		md: 'loading-md',
		lg: 'loading-lg',
	}[size];

	const variantClass = {
		spinner: 'loading-spinner',
		dots: 'loading-dots',
		ring: 'loading-ring',
		ball: 'loading-ball',
		bars: 'loading-bars',
		infinity: 'loading-infinity',
	}[variant];

	return (
		<div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
			<span className={`loading ${variantClass} ${sizeClass} ${color}`}></span>
			{label && (
				<span className="text-xs font-black uppercase tracking-widest italic opacity-50 animate-pulse">
					{label}
				</span>
			)}
		</div>
	);
};

// --- Table ---
export const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
	<div className="overflow-x-auto border border-base-300 rounded-xl shadow-sm bg-base-100">
		<table className={`table table-lg w-full ${className}`}>{children}</table>
	</div>
);

export const TableHead = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
	<thead className={`text-primary bg-base-200/50 ${className}`}>
		{children}
	</thead>
);

export const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
	<tr className={`border-b border-base-300 text-xs uppercase tracking-widest opacity-60 ${className}`}>
		{children}
	</tr>
);

// --- Carousel---
interface CarouselProps {
	images: string[];
	className?: string;
	autoPlay?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({ 
	images, 
	className = "",
}) => {
	return (
		<div 
			className={`carousel carousel-vertical rounded-box h-96 w-full ${className}`}>
			{images.map((src, index) => (
				<div key={index} className="carousel-item h-full w-full shrink-0">
					<img src={src} className="w-full h-full object-cover" alt={`Slide ${index}`} />
				</div>
			))}
		</div>
	);
};

// --- Hero ---
interface HeroProps {
	title?: React.ReactNode;
	description?: React.ReactNode;
	backgroundImage?: string;
	actions?: React.ReactNode;
	overlayOpacity?: string;
	className?: string;
}

export const Hero: React.FC<HeroProps> = ({
	title = "Powering AI Infrastructure",
	description = "High-performance GPU instances designed for large-scale training at a fraction of legacy cloud costs.",
	backgroundImage = "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000",
	actions,
	overlayOpacity = "bg-opacity-60",
	className = ""
}) => {
	return (
		<div
			className={`hero min-h-screen rounded-none border-none shadow-none ${className}`}
			style={{
				backgroundImage: `url(${backgroundImage})`,
			}}
		>
			<div className={`hero-overlay ${overlayOpacity}`}></div>
			
			<div className="hero-content text-neutral-content text-center">
				<div className="max-w-md">
					{title && <h1 className="mb-5 text-5xl font-bold">{title}</h1>}
					{description && <p className="mb-5">{description}</p>}
					{actions && <div className="flex justify-center gap-2">{actions}</div>}
				</div>
			</div>
		</div>
	);
};