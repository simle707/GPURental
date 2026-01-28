'use client'
import { Check, Copy, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

export const PasswordField: React.FC<{ password?: string, disabled: boolean }> = ({ password, disabled }) => {
	const [show, setShow] = useState(false);
	const [copied, setCopied] = useState(false);

	if (!password) return null;

	const handleCopy = () => {
		navigator.clipboard.writeText(password);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

 return (
		<div className={`flex items-center gap-3 bg-background border border-border/60 rounded-md px-3 h-10 transition-all ${!disabled ? 'opacity-50' : 'hover:border-primary/30'}`}>
			<KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
			<span className="flex-1 text-xs font-mono tracking-wider select-all">
				{show ? password : '••••••••'}
			</span>
			
			<div className="flex items-center gap-2 border-l pl-2 border-border/50">
				<button
					disabled={!disabled}
					onClick={() => setShow(!show)}
					className={`transition-colors ${!disabled ? 'text-muted-foreground/30' : 'text-muted-foreground hover:text-primary'}`}
				>
					{show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
				</button>
				<button
					disabled={!disabled}
					onClick={handleCopy}
					className={`transition-colors ${!disabled ? 'text-muted-foreground/30' : 'text-muted-foreground hover:text-primary'}`}
				>
					{copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
				</button>
			</div>
		</div>
	);
};