
/**
 * Types for the simulation
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

/**
 * Types for the simulation
 */
export interface SimulationParams {
  lambda: number; // Arrivals per hour
  mu: number;     // Service rate per server (clients per hour)
  s: number;      // Number of servers
  duration: number; // Simulation duration in minutes
  seed?: number;  // Seed for random number generator
  products?: Product[]; // Available products
  day?: string;      // Optional day name
  timeLabel?: string; // Optional time range (e.g., "08:00 - 10:00")
  customLabel?: string; // Optional custom nickname
  hour?: string;      // "01" through "12"
  period?: string;    // "AM" or "PM"
}

export interface ClientEvent {
  id: number;
  arrivalTime: number; // in minutes
  startTime: number;   // in minutes
  endTime: number;     // in minutes
  waitTime: number;    // in minutes
  serviceDuration: number; // in minutes
  productCount: number;
  totalSale: number;   
  purchasedProducts: string[]; // List of product names
  serverIndex: number; // New field
}

export interface SimulationResult {
  wq: number; // Average wait time in queue (minutes)
  w: number;  // Average time in system (minutes)
  lq: number; // Average number of clients in queue
  l: number;  // Average number of clients in system
  utilization: number; // System utilization (0-1)
  totalProducts: number;
  totalRevenue: number; // New field
  clients: ClientEvent[];
}

/**
 * M/M/s (Erlang-C) Mathematical Model
 */
export function calculateMMS(params: SimulationParams) {
  // Validate and sanitize inputs
  const lambda = Math.max(0.001, params.lambda || 0);
  const mu = Math.max(0.001, params.mu || 0);
  const s = Math.max(1, Math.floor(params.s || 1));
  
  const rho = lambda / (s * mu);

  if (rho >= 0.999) { // Handle near-saturation or saturation
    return {
      wq: Infinity,
      w: Infinity,
      lq: Infinity,
      l: Infinity,
      utilization: rho,
    };
  }

  // Calculate P0 (Probability of zero customers in system)
  let sum = 0;
  for (let n = 0; n < s; n++) {
    const term = Math.pow(lambda / mu, n) / factorial(n);
    if (isNaN(term)) break;
    sum += term;
  }
  const term2 = (Math.pow(lambda / mu, s) / (factorial(s) * (1 - rho)));
  
  if (isNaN(term2) || !isFinite(term2)) {
     return { wq: Infinity, w: Infinity, lq: Infinity, l: Infinity, utilization: rho };
  }

  const p0 = 1 / (sum + term2);

  const lq = (p0 * Math.pow(lambda / mu, s) * rho) / (factorial(s) * Math.pow(1 - rho, 2));
  const wq = lq / lambda; // in hours
  const w = wq + (1 / mu); // in hours
  const l = lambda * w;

  return {
    wq: isNaN(wq) ? 0 : wq * 60, // Convert to minutes
    w: isNaN(w) ? 0 : w * 60,   // Convert to minutes
    lq: isNaN(lq) ? 0 : lq,
    l: isNaN(l) ? 0 : l,
    utilization: isNaN(rho) ? 0 : rho,
  };
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Discrete Event Simulation (DES) for FIFO Table
 */
export function runDES(params: SimulationParams): ClientEvent[] {
  const lambda = Math.max(0.1, params.lambda || 0);
  const mu = Math.max(0.1, params.mu || 0);
  const duration = Math.max(1, params.duration || 60);
  const s = Math.max(1, Math.floor(params.s || 1));

  const clients: ClientEvent[] = [];
  let currentTime = 0;
  let clientId = 1;

  // Track the time each server becomes free
  const serversFreeAt = new Array(s).fill(0);

  // Limit total clients to prevent browser freeze in case of extreme parameters
  const MAX_CLIENTS = 10000;
  
  while (currentTime < duration && clients.length < MAX_CLIENTS) {
    // Generate next arrival
    // Inter-arrival time = -ln(U) / (lambda/60)
    const interArrival = -Math.log(Math.max(0.0001, Math.random())) / (lambda / 60);
    currentTime += interArrival;
    
    if (currentTime > duration) break;

    // Service duration = -ln(U) / (mu/60)
    const serviceDuration = -Math.log(Math.max(0.0001, Math.random())) / (mu / 60);

    // Generate product count (1 to 4)
    const productCount = Math.floor(Math.random() * 4) + 1;
    
    // Calculate total sale by randomly picking products if available
    let totalSale = 0;
    const purchasedProducts: string[] = [];

    if (params.products && params.products.length > 0) {
      for (let i = 0; i < productCount; i++) {
        const randomIndex = Math.floor(Math.random() * params.products.length);
        const product = params.products[randomIndex];
        totalSale += product.price;
        purchasedProducts.push(product.name);
      }
    } else {
      totalSale = productCount * 20; 
      for (let i = 0; i < productCount; i++) purchasedProducts.push('Producto Genérico');
    }

    // Find the first available server
    let serverIndex = 0;
    let minFreeTime = serversFreeAt[0];
    
    for (let i = 0; i < s; i++) {
        if (serversFreeAt[i] <= currentTime) {
            serverIndex = i;
            break;
        }
        if (serversFreeAt[i] < minFreeTime) {
            minFreeTime = serversFreeAt[i];
            serverIndex = i;
        }
    }

    const startTime = Math.max(currentTime, serversFreeAt[serverIndex]);
    const endTime = startTime + serviceDuration;
    const waitTime = startTime - currentTime;

    clients.push({
      id: clientId++,
      arrivalTime: currentTime,
      startTime,
      endTime,
      waitTime,
      serviceDuration,
      productCount,
      totalSale,
      purchasedProducts,
      serverIndex: serverIndex + 1, // 1-indexed for display
    });

    serversFreeAt[serverIndex] = endTime;
  }

  return clients;
}

/**
 * Main simulation function
 */
export function simulate(params: SimulationParams): SimulationResult {
  const mmsStats = calculateMMS(params);
  const clients = runDES(params);
  const totalProducts = clients.reduce((sum, c) => sum + c.productCount, 0);
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalSale || 0), 0);
  
  return {
    ...mmsStats,
    totalProducts,
    totalRevenue,
    clients,
  };
}
