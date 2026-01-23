'use client';
import { useEffect, useState } from 'react';
import { Console } from '@/components/Console';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/components/Providers';
import { useInstancePolling } from '@/hooks/useInstancePolling';
import { toUSD } from '@/lib/utils';
import { Instance } from '@/types';

export default function ConsolePage() {
    const { isLoggedIn, logout } = useAuth();
    const { showToast } = useNotification();
    const [instances, setInstances] = useState<Instance[]>([]);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRented = async () => {
        try {
            const res = await fetch('/api/proxy/virtual_machine',{ method: 'GET', credentials: 'include' });
            if (res.status === 401 || res.status === 403) { logout(); return; }
            const resData = await res.json();
            if (resData.status === 0 && resData.data.records) {
                const formatted: Instance[] = resData.data.records.map((item: any) => ({
                    id: item.id,
                    name: item.host?.name || 'Unnamed Instance',
                    gpuType: item.gpu_type,
                    gpuCount: item.gpu_count,
                    status: item.status,
                    ipAddress: item.internal_ip || 'Assigning...',
                    costPerHour: toUSD(item.tracker?.unit_price) || 0,
                    totalCost: toUSD(item.tracker?.amount) || 0,
                    startedAt: item.created,
                    jupyterUrl: `https://${item.short_id}.proxy.featurize.cn/`,
                    sshCommand: item.ssh_port 
                        ? `ssh featurize@workspace.featurize.cn -p ${item.ssh_port}` 
                        : 'Initializing SSH...',
                    password: item.featurize_password ? item.featurize_password : 'Initializing PASSWORD...'
                }));
                setInstances(formatted);
            }
        } catch (error) { 
            console.error('Error fetching GPU specs:', error); 
        }
    };

    const refreshSingleInstance = async (id: string) => {
        try {
            const res = await fetch(`/api/proxy/virtual_machine/${id}`);
            const resData = await res.json();            
        
            if (resData.success && resData.data) {
                const updatedItem = resData.data;
                
                setInstances(prev => prev.map(ins => {
                    if (ins.id === id) {
                        return {
                            ...ins,
                            status: updatedItem.status,
                            ipAddress: updatedItem.internal_ip || ins.ipAddress,
                            sshCommand: updatedItem.ssh_port 
                                ? `ssh featurize@workspace.featurize.cn -p ${updatedItem.ssh_port}` 
                                : ins.sshCommand
                        };
                    }
                    return ins;
                }));
                
                return updatedItem.status;
            }
        } catch (error) {
            console.error(`Failed to refresh instance ${id}:`, error);
        }
    };

    const handleTerminate = async (instanceId: string) => {
        setActionLoading(true);
        try {
            const response = await fetch(`/api/proxy/virtual_machine/${instanceId}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ instance_id: instanceId }),
                credentials: 'include'
            });

            if (response.ok) {
                showToast("Instance termination scheduled...")
                await fetchRented();
            }
        } catch (e) { 
            showToast("Network error during termination", "error");
        } finally { 
            setActionLoading(false); 
        }
    };

  useInstancePolling(isLoggedIn, true, instances, refreshSingleInstance, fetchRented);

  useEffect(() => { if (isLoggedIn) fetchRented(); }, [isLoggedIn]);

  return (
    <Console 
      instances={instances} 
      onTerminate={handleTerminate} 
      actionLoading={actionLoading} 
    />
  );
}