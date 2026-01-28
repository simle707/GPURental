'use client'
import React from 'react';
import { Zap, ShieldCheck, Globe, Cpu, Clock, Lock } from 'lucide-react';
import { Badge, Button, Card, Carousel, Hero } from '@/components/ui';
import Link from 'next/link';

export default function WhyFeaturize() {
    const features = [
        { icon: <Zap className="w-8 h-8" />, title: "Performance First", desc: "Native NVLink support and high-speed NVMe storage ensure your LLM training never hits a bottleneck." },
        { icon: <ShieldCheck className="w-8 h-8" />, title: "Enterprise Grade", desc: "ISO 27001 certified data centers with 99.9% uptime SLA for critical production workloads." },
        { icon: <Globe className="w-8 h-8" />, title: "Global Clusters", desc: "Low-latency nodes distributed across North America, Europe, and Asia for seamless edge computing." },
        { icon: <Clock className="w-8 h-8" />, title: "60s Spin-up", desc: "Instances are ready in under a minute with pre-configured CUDA drivers and Docker environments." }
    ];

    const stats = [
        { label: "Active GPUs", value: "2,500+" },
        { label: "Data Centers", value: "12" },
        { label: "Uptime SLA", value: "99.9%" },
        { label: "Cost Saving", value: "60%" },
    ];

    // const gpuImages = [
    //     "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000",
    //     "https://imgs.699pic.com/images/600/117/787.jpg!list1x.v2",
    //     "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2000"
    // ];

    return (
        <div className="flex flex-col gap-20 ">    
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen -mt-8">
                <Hero 
                    actions={
                    <>
                        <Button variant="primary">
                            <Link href={`/marketplace`}>Get Started</Link>
                        </Button>
                        <Button variant="outline" className="text-white border-white hover:bg-white/20">
                            <Link href={`/`}>View Pricing</Link>
                        </Button>
                    </>
                    }
                />
            </div>  

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-base-200/50 border border-base-300 rounded-2xl p-8 flex flex-col items-center justify-center space-y-1">
                        <span className="text-4xl font-black italic tracking-tighter text-primary">{stat.value}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <Card key={i} className="aspect-square flex flex-col items-center justify-center p-8 text-center group border-base-300 hover:border-primary/50 transition-all shadow-sm">
                        <div className="w-16 h-16 flex shrink-0 items-center justify-center bg-primary/10 text-primary rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                            {f.icon}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">
                                {f.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-[180px] mx-auto">
                                {f.desc}
                            </p>
                        </div>
                    </Card>
                ))}
            </section>

            <section className="bg-neutral p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                <div className="flex-1 z-10 space-y-6 text-white">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
                        Stop overpaying for <br /> idle capacity.
                    </h2>
                    <ul className="space-y-4 text-white/70 font-medium">
                        <li className="flex items-center gap-3">✓ Billed by the second.</li>
                        <li className="flex items-center gap-3">✓ Dedicated RTX 4090s and H100s.</li>
                        <li className="flex items-center gap-3">✓ Automated failover.</li>
                    </ul>
                    <Button variant="primary" size="lg" className="px-12">
                        <Link href={`/marketplace`}>Start Deploying</Link>
                        
                    </Button>
                </div>
            </section>
        </div>
            
    );
}