'use client'
import React, { useEffect, useState } from 'react';
import { Instance } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Dialog } from './ui';
import { Terminal, Power, Trash2, Clock, Server, ExternalLink, Copy, Check } from 'lucide-react';
import { PasswordField } from './PasswordToggle'

const getUptime = (startTime: string) => {
  if (!startTime) return 'N/A'
  const start = new Date(startTime).getTime();
  if (isNaN(start)) return '...'

  const now = Date.now()
  const diff = Math.max(0, now - start)

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
  return `${hours}h ${mins}m`

}

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string, color: string }> = {
    start_pending: { label: 'Starting', color: 'bg-yellow-500' },
    online: { label: 'online', color: 'bg-green-500' },
    
    end_pending: { label: 'Shutting', color: 'bg-orange-500' },
    terminating: { label: 'terminating', color: 'bg-red-500' },
    
    archived: { label: 'archived', color: 'bg-gray-500' },
    
    invalid: { label: 'invalid', color: 'bg-error' },
  };

  return statusMap[status] || { label: status, color: 'bg-blue-500' };
};

const CopyButton: React.FC<{ text: string, disabled: boolean }> = ({ text, disabled }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button disabled={!disabled} onClick={handleCopy} className={`transition-colors ${!disabled ? 'text-muted-foreground/30 cursor-not-allowed' : 'text-muted-foreground hover:text-primary'}`} title="Copy SSH Command">
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

interface ConsoleProps {
  instances: Instance[];
  onTerminate: (id: string) => void;
  // onReboot: (id: string) => void;
  actionLoading: boolean;
}
type ActionType = 'reboot' | 'terminate';

export const Console: React.FC<ConsoleProps> = ({ instances, onTerminate, actionLoading }) => {
  const [, setTick] = useState(0)
  const [confirmConfig, setConfirmConfig] = useState<{ id: string; type: ActionType } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    if (!actionLoading) setConfirmConfig(null)
  }, [actionLoading])

  const renderContent = (item: any, statusConfig: any, instance: Instance) => {
    const isRunning = instance.status === 'online';
    switch (item.label) {
      case 'Status':
        return (
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
            <span className="font-medium capitalize">{statusConfig.label}</span>
          </div>
        );
      case 'Uptime':
        return (
          <div className="flex items-center gap-2 font-mono">
            <Clock className="w-3 h-3 text-muted-foreground" />
            {getUptime(instance.startedAt)}
          </div>
        );
      case 'IP':
        return (
          <div className="font-mono">{instance.ipAddress || 'Pending...'}</div>
        );
      case 'HourlyRate':
        if (!isRunning) {
          return <div>Calculating...</div>;
        }
        const gpuName = (instance.gpuType || '').toUpperCase();
        let unitPrice = 0;

        if (gpuName.includes('4090')) {
          unitPrice = 0.38;
        } else if (gpuName.includes('6000')) {
          unitPrice = 1.26;
        } else {
          unitPrice = instance.costPerHour || 0; 
        }

        const totalHourly = unitPrice * instance.gpuCount;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-primary text-base">
              ${totalHourly.toFixed(2)}/hr
            </span>
            {/* <span className="text-[10px] opacity-50 font-mono">
              (${unitPrice.toFixed(2)} × {instance.gpuCount} Unit{instance.gpuCount > 1 ? 's' : ''})
            </span> */}
          </div>
        );
      default:
        return (
          <div className="font-medium">$ {instance.costPerHour.toFixed(2)}</div>
        )
    }
  }

  if (instances.length === 0) {
    return (
      <div className="text-center py-20 bg-base-100 rounded-box border border-dashed border-base-300">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#3d38e1] mb-8 shadow-lg">
          <Server className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Active rented Instances</h2>
        <p className="text-muted-foreground">Visit the marketplace to provision your first GPU cluster.</p>
      </div>
    );
  }
  

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Instances</h2>
      
      <Dialog
        isOpen={!!confirmConfig}
        onClose={() => !actionLoading && setConfirmConfig(null)}
        title={confirmConfig?.type === 'terminate' ? "Terminate Instance" : "Reboot Instance"}
        confirmText={confirmConfig?.type === 'terminate' ? "Terminate Now" : "Confirm Reboot"}        
        variant={confirmConfig?.type === 'terminate' ? "error" : "warning"}
        onConfirm={() => {
          if (!confirmConfig) return;
          confirmConfig.type === 'terminate' 
            ? onTerminate(confirmConfig.id) 
            : onTerminate(confirmConfig.id) 
            // : onReboot(confirmConfig.id);
        }}
        confirmLoading={actionLoading}
      >
        {confirmConfig?.type === 'terminate' ? (
          <>
            Are you sure you want to terminate this instance? 
            <div className="mt-2 p-2 bg-error/10 text-error text-xs rounded border border-error/20">
              Warning: All unsaved data on the local disk will be permanently lost.
            </div>
          </>
        ) : (
          <>
            Are you sure you want to reboot this instance? 
            <p className="mt-2 text-sm opacity-80">
              The system will be unavailable for a few minutes during the restart process.
            </p>
          </>
        )}
      </Dialog>

      <div className="grid gap-6">
        {instances.map((instance) => {
          const statusConfig = getStatusConfig(instance.status)
          const isRunning = instance.status === 'online'

          return(
            <Card key={instance.id} className="transition-all hover:border-primary/50 shadow-sm">
              <div className={`h-1.5 w-full ${statusConfig.color}`} />
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-3">
                      {instance.name}
                      <Badge variant="outline">{instance.gpuCount}x {instance.gpuType}</Badge>
                    </CardTitle>
                    <span className="text-xs font-mono text-muted-foreground mt-1">ID: {instance.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="error" 
                    className="text-destructive hover:text-destructive border-destructive/20" 
                    title="Terminate Instance"
                    onClick={() => setConfirmConfig({ id: instance.id, type: 'terminate' })}
                    disabled={!isRunning}
                  >
                    <Power className={`w-4 h-4`} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">      
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border/50 space-y-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Entry Points</div>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-between group px-3 bg-background border-border/60 hover:border-primary/30"
                        onClick={() => window.open(instance.jupyterUrl, "_blank")}
                        disabled={!isRunning}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-[#F37626] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.11 13.06c.66 0 1.2.55 1.2 1.22s-.54 1.22-1.2 1.22-1.2-.55-1.2-1.22.54-1.22 1.2-1.22zM21.5 12.3c0 6.6-4.22 8.78-9.5 8.78-5.32 0-9.5-2.22-9.5-8.8 0-6.55 4.18-8.76 9.5-8.76 5.28 0 9.5 2.24 9.5 8.78zm-1.34 0c0-5.06-3.66-7.44-8.16-7.44-4.5 0-8.16 2.38-8.16 7.44s3.66 7.44 8.16 7.44 8.16-2.38 8.16-7.44zM16.9 13.06c.66 0 1.2.55 1.2 1.22s-.54 1.22-1.2 1.22-1.2-.55-1.2-1.22.54-1.22 1.2-1.22z" />
                          </svg>
                          <span className="text-sm font-medium">Open JupyterLab</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Button>
                      <div className={`flex items-center gap-3 bg-background border border-border/60 rounded-md px-3 h-10 transition-all ${!isRunning ? 'opacity-50' : 'hover:border-primary/30'}`}>
                        <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-xs font-mono text-foreground/80 truncate flex-1">
                          {instance.sshCommand}
                        </span>
                        <div className="border-l pl-2 border-border/50">
                          <CopyButton text={instance.sshCommand} disabled={isRunning} />
                        </div>
                      </div>

                      <PasswordField password={instance.password} disabled={isRunning} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Status', val: statusConfig.label, dot: statusConfig.color },
                    { label: 'Uptime', val: getUptime(instance.startedAt), icon: Clock },
                    { label: 'IP', val: instance.ipAddress },
                    { label: 'HourlyRate', val: `${instance.totalCost}` }
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <span className="text-muted-foreground text-xs uppercase tracking-wider">{item.label}</span>
                      {renderContent(item, statusConfig, instance)}
                    </div>
                  ))}
                </div>
                
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
};