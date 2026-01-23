export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// export interface Instance {
//   id: string;
//   name: string;
//   gpuType: string;
//   gpuCount: number;
//   status: 'running' | 'provisioning' | 'stopped';
//   ipAddress: string;
//   costPerHour: number;
//   startedAt: string;
//   // Connection details
//   jupyterUrl: string;
//   sshCommand: string;
// }
export interface Instance {
  id: string;
  name: string;
  gpuType: string;
  gpuCount: number;
  status: string;
  ipAddress: string | null;
  costPerHour: number;
  totalCost: number;
  startedAt: string;
  jupyterUrl: string;
  sshCommand: string;
  password?: string; // 真实数据里有密码
}

// export interface GpuSpecs {
//   id: string;
//   name: string;
//   vram: string;
//   bandwidth: string;
//   cudaCores: number;
//   pricePerHour: number;
//   description: string;
// }

interface LTPItem {
  name: 'day' | 'week' | 'month';
  days: number;
  amount: number;
}

export interface GpuSpec {
  id: string;
  name: string;
  internal_ip: string;
  ltps: LTPItem[];
  gpu_type: string;
  gpu_memory: number;
  gpu_count: number;
  memory: number;
  cpu_type: string;
  cpu_count: number;
  disk: Record<string, number>;
  theme: string;
  status: string;
  available_gpu_count: number;
  available_memory: number;
  available_cpu_count: number;
  available_disks: {string: number}[];
  available_unit_count: number;
  unit_price: number;
  unit_cpu_count: number;
  unit_memory: number;
  unit_disk: number;
  hostname: string;
  maintain_desc: string;
  maintaining_at: string;
  description?: string;
}

export enum Tab {
  MARKETPLACE = 'marketplace',
  CONSOLE = 'console',
}