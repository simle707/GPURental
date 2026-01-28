'use client'
import React, { useState } from 'react';
import { GpuSpec } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Slider, Alert, Loading } from './ui';
import { Check, Minus, Plus, Server } from 'lucide-react';
import { toUSD, toGB, formatCurrency } from '../lib/utils';

interface MarketplaceProps {
	gpuSpecs: GpuSpec[];
	onRent: (host_machine_id: string, units: number) => any;
	isLoggedIn: boolean;
	actionLoading: boolean;
	isLowBalance: boolean;
	onLoginRequest: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ gpuSpecs, onRent, isLoggedIn, actionLoading, isLowBalance, onLoginRequest }) => {
	const [selectedCount, setSelectedCount] = useState<number>(1);
	const [rentingGpuId, setRentingGpuId] = useState<number | null>(null) 

	const handleRentClick = (index: number) => {
		if (!isLoggedIn) {
			onLoginRequest();
			return;
		}
		setSelectedCount(1);
		setRentingGpuId(index)
	};

	const confirmRent = async(host_machine_id: string) => {
		const success = await onRent(host_machine_id, selectedCount);

		if (success) {
			setRentingGpuId(null);
			setSelectedCount(1);
		}
		
		
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold tracking-tight">Available Instances</h2>
				<p className="opacity-60 mt-2">High-performance GPU clusters ready for your workloads</p>
			</div>

			{ gpuSpecs.length === 0 && (
			<div className="flex flex-col items-center justify-center py-32 bg-base-100">
				<Loading variant='spinner' size='lg'/>

				<div className="mt-8 text-center space-y-2">
					<h2 className="text-xs font-mono opacity-40 uppercase tracking-tighter">
						Fetching Inventory
					</h2>
				</div>
			</div>
			)
			}
			{ gpuSpecs.map((spec, index) => {
				const isRenting = rentingGpuId === index
				const stat = [
					{ 
						label: 'CPU', 
						val: `${spec.cpu_count} vCPU` 
					},
					{ 
						label: 'RAM', 
						val: `${Math.round(spec.memory / (1024 ** 3))} GB` 
					},
					{ 
						label: 'Disk', 
						val: `${Math.round(spec.unit_disk / (1024 ** 3))} GB` 
					},
					{ 
						label: 'Stock', 
						val: `${spec.available_unit_count} Units` 
					}
				]

				return(
					<Card key={spec.name} className="overflow-hidden border-primary/50 shadow-lg">
						<div className="h-2 bg-linear-to-r via-purple-600" />
						
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<Badge variant="success">High Availability</Badge>
									<CardTitle className="text-2xl mt-2">{spec.gpu_type}</CardTitle>
									<p className="opacity-60 mt-1">{toGB(spec.gpu_memory).toFixed(0)} GB GDDR6X VRAM</p>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold">{formatCurrency(toUSD(spec.unit_price))}</div>
									<div className="text-xs opacity-60">/gpu/hour</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<p className="text-base leading-relaxed opacity-80">
								{spec.description || 'The ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics. Ideal for LLM inference, Stable Diffusion training, and 3D rendering.'}
							</p>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
								{stat.map(stat => (
									<div key={stat.label} className="bg-base-200 p-3 rounded flex flex-col">
										<span className="opacity-50 text-xs uppercase">{stat.label}</span>
										<span className="font-mono font-medium">{stat.val}</span>
									</div>
								))}
							</div>

							{isRenting ? (
									<div className="bg-base-200 border border-primary/30 p-4 rounded-lg space-y-4 animate-in zoom-in-95">
										<h4 className="font-semibold flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Configure Rental</h4>
										{ isLowBalance && (
											<Alert variant="error" className="mb-4">
												Insufficient balance. Please top up your account.
											</Alert>
										)}
										<div className="space-y-4">
											<div className="flex justify-between text-sm">
												<span>Quantity</span>
												<span className="font-bold">{selectedCount} GPU{selectedCount > 1 ? 's' : ''}</span>
											</div>
											<div className='flex justify-between items-center gap-4 py-2'>
												<Button 
													circle={true} size='xs' variant='outline' disabled={selectedCount <= 1 || actionLoading || isLowBalance}
													onClick={() => setSelectedCount(Math.max(1, selectedCount - 1))} >
													<Minus className="w-3 h-3" />
												</Button>
												<div className='flex-1'>
													<Slider value={selectedCount} max={spec.available_unit_count} onChange={setSelectedCount} disabled={isLowBalance} />
												</div>
												<Button 
													circle={true} size='xs' variant='outline' disabled={selectedCount >= spec.available_unit_count || actionLoading || isLowBalance}
													onClick={() => setSelectedCount(Math.min(spec.available_unit_count, selectedCount + 1))}
												>
													<Plus className="w-3 h-3" />
												</Button>
											</div>
											
											<div className="flex justify-between items-center text-sm pt-2 border-t border-base-300">
													<span className="opacity-60">Total Hourly Rate</span>
													<span className="font-bold text-lg">${(selectedCount * toUSD(spec.unit_price)).toFixed(2)}/hr</span>
											</div>
											<div className="flex gap-2">
												<Button onClick={() => {
													setRentingGpuId(null)
												}} variant="ghost" className="flex-1" disabled={actionLoading}>Cancel</Button>
												<Button onClick={() => confirmRent(spec.id)} variant="primary" className="flex-1" loading={actionLoading} disabled={isLowBalance}>Confirm & Deploy</Button>
											</div>
										</div>
									</div>
							) : (
								<>
									{spec.available_unit_count===0 && (
										<Alert variant="warning" className="mb-4">
											The GPU is sold out ！！！
										</Alert>
									)}
									<Button variant="primary" size="md" className="w-full" onClick={()=>handleRentClick(index)} disabled={spec.available_unit_count===0}>
										Rent Instance
									</Button>
								</>
								
							)}
						</CardContent>
					</Card>
			)})}
			
		</div>
	);
};