import { Zap, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button, Table, TableHead, TableRow } from '@/components/ui'; 

export default function GpuPricingPage() {
    const pricingData = [
        { model: 'NVIDIA RTX 4090', vram: '24 GB', ram: '120 GB', vcpu: '24', hourly: '$0.84', monthly: '$604.80', popular: true },
        { model: 'NVIDIA H100', vram: '80 GB', ram: '256 GB', vcpu: '56', hourly: '$3.50', monthly: '$2,520.00', popular: false },
        { model: 'NVIDIA A100', vram: '40 GB', ram: '180 GB', vcpu: '32', hourly: '$1.20', monthly: '$864.00', popular: false },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="absolute -left-4 top-0 text-[120px] font-black opacity-[0.03] select-none tracking-tighter">PRICING</div>
            <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-0.5 w-12 bg-primary"></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Cost Efficiency</span>
                </div>
                <h1>GPU <span className="text-primary border-primary/20">PRICING</span></h1>
                <p className="text-muted-foreground text-lg max-w-xl font-medium pt-4">
                    Transparent billing, zero overhead. Designed for <span className="text-base-content underline decoration-primary decoration-2 underline-offset-4">ML teams</span> scaling from zero to production.
                </p>
            </div>

            <div className="overflow-x-auto border border-base-300 rounded-3xl">
                <Table >
                    <TableHead>
                        <TableRow>
                            <th className="py-6 pl-10">GPU Architecture</th>
                            <th className="text-center">VRAM Capacity</th>
                            <th className="text-center">vCPU / System RAM</th>
                            <th className="text-right pr-10">GPU Rate</th>
                        </TableRow>
                    </TableHead>
                    <tbody>
                        {pricingData.map((item, idx) => (
                            <TableRow key={idx} className="hover:bg-primary/5 transition-colors border-b border-base-300/50 group">
                                <td className="py-8 pl-10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-3">
                                            <span className="text-xl font-black italic tracking-tight uppercase group-hover:text-primary transition-colors">
                                                {item.model}
                                            </span>
                                            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Ada Lovelace / 4nm Process</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-8 pl-10">
                                    <div className="inline-block px-4 py-2 rounded-lg">
                                    <span className="text-lg font-black">{item.vram}</span>
                                    </div>
                                </td>

                                <td className="py-8 pl-10">
                                    <div className="flex flex-col text-sm">
                                    <span className="font-bold">{item.vcpu} vCPUs</span>
                                    <span className="opacity-50 font-mono text-xs">{item.ram} GB RAM</span>
                                    </div>
                                </td>

                                <td className="py-8 pl-10">
                                    <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1">
                                        <span className="text-4xl font-black italic tracking-tighter text-primary">
                                        
                                            {item.hourly}
                                        </span>
                                        <span className="text-xs font-bold opacity-40 uppercase">/hr</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase opacity-30 mt-1 tracking-widest">
                                        Estimated {item.monthly}/mo
                                    </span>
                                    </div>
                                </td>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </div>
            

            <div className="bg-base-300 grid grid-cols-1 md:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-base-300 shadow-2xl">
                {[
                    { icon: <ShieldCheck className="w-8 h-8" />, title: 'Enterprise SLA', desc: '99.9% uptime guaranteed with automated failover.' },
                    { icon: <Zap className="w-8 h-8" />, title: 'Instant Spin-up', desc: 'Ready to use in under 60s with pre-installed drivers.' },
                    { icon: <Globe className="w-8 h-8" />, title: 'Multi-Region', desc: 'Deploy clusters across US, EU, and Asia nodes.' },
                ].map((f, i) => (
                    <div 
                        key={i} 
                        className="group bg-base-100 p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-base-200/50 relative overflow-hidden"
                    >
                        <div className="relative mb-8">
                            <div className="absolute -inset-3 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-primary/50 transition-colors"></div>
                            <div className="absolute -inset-1 border border-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
                            <div className="w-20 h-20 flex shrink-0 items-center justify-center bg-primary text-primary-content rounded-2xl shadow-[0_0_20px_rgba(var(--p),0.3)] z-10 relative group-hover:rotate-[360deg] transition-transform duration-1000">
                                {f.icon}
                            </div>
                        </div>

                        <div className="space-y-3 z-10">
                            <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none group-hover:text-primary transition-colors">
                                {f.title}
                            </h4>
                            <div className="w-8 h-0.5 bg-primary/20 mx-auto group-hover:w-16 transition-all"></div>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-[200px] mx-auto opacity-70 group-hover:opacity-100">
                                {f.desc}
                            </p>
                        </div>

                        <span className="absolute bottom-4 right-6 text-[40px] font-black opacity-[0.02] italic tracking-tighter select-none group-hover:opacity-[0.05] transition-opacity">
                            0{i + 1}
                        </span>
                    </div>
                ))}
            </div>

            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-neutral py-20 px-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:pl-20 flex flex-col items-start">
                    <div className="relative z-10 mb-8">
                        <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Ready to benchmark?</h2>
                        <p className=" text-white/60 font-medium">Get started with $10 free credit on your first instance.</p>
                    </div>
                    <div className="relative z-10 flex gap-6">
                        <Button variant="primary">
                            <Link href="/marketplace">Deploy Now</Link>
                        </Button>
                        <Button variant="ghost" className={`text-white border-white hover:bg-white/20`}>Read Docs</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
