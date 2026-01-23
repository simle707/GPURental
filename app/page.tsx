'use client';
import { useEffect, useState } from 'react';
import { Marketplace } from '@/components/Marketplace';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/components/Providers';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const { isLoggedIn, login } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();
  const [gpuSpecs, setGpuSpecs] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLowBalance, setIsLowBalance] = useState(false)

  const fetchGpuSpecs = async () => {
    try {
      const res = await fetch('/api/proxy/host_machine');
      const resData = await res.json();
      if (resData.success) setGpuSpecs(resData.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchGpuSpecs(); }, []);

  const handleRent = async (host_machine_id: string, units: number) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/proxy/virtual_machine', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host_machine_id, units }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.data?.status !== 10001) {
        showToast("Instance created successfully!", "success");
        setActionLoading(false)
        router.push('/console');
        return true;
      } else {
        const bizStatus = data.data?.status;
        if (bizStatus === 10001) {
          // showToast("Insufficient balance. Please top up your account.", "error");
          setIsLowBalance(true)
          // setTimeout(() => window.open('https://featurize.cn/', '_blank'), 3000);
        } else {
          showToast(data.message || "Rental failed", "error");
        }
        return false;
      }
    } catch (e) { showToast("Network error during rental", "error"); return false;
    } finally { setActionLoading(false); }
  };

  return (
    <Marketplace
      gpuSpecs={gpuSpecs}
      onRent={handleRent}
      isLoggedIn={isLoggedIn}
      actionLoading={actionLoading}
      isLowBalance={isLowBalance}
      onLoginRequest={login}
    />
  );
}