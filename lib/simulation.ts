
/**
 * Types for the simulation
 */
export interface SimulationParams {
  lambda: number; // Arrivals per hour
  mu: number;     // Service rate per server (clients per hour)
  s: number;      // Number of servers
  duration: number; // Simulation duration in minutes
  seed?: number;  // Seed for random number generator
}

export interface ClientEvent {
  id: number;
  arrivalTime: number; // in minutes
  startTime: number;   // in minutes
  endTime: number;     // in minutes
  waitTime: number;    // in minutes
  serviceDuration: number; // in minutes
  productCount: number; // New field
}

export interface SimulationResult {
  wq: number; // Average wait time in queue (minutes)
  w: number;  // Average time in system (minutes)
  lq: number; // Average number of clients in queue
  l: number;  // Average number of clients in system
  utilization: number; // System utilization (0-1)
  totalProducts: number; // New field
  clients: ClientEvent[];
}

/**
 * M/M/s (Erlang-C) Mathematical Model
 */
export function calculateMMS(params: SimulationParams) {
  const { lambda, mu, s } = params;
  const rho = lambda / (s * mu);

  if (rho >= 1) {
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
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  const term2 = (Math.pow(lambda / mu, s) / (factorial(s) * (1 - rho)));
  const p0 = 1 / (sum + term2);

  const lq = (p0 * Math.pow(lambda / mu, s) * rho) / (factorial(s) * Math.pow(1 - rho, 2));
  const wq = lq / lambda; // in hours
  const w = wq + (1 / mu); // in hours
  const l = lambda * w;

  return {
    wq: wq * 60, // Convert to minutes
    w: w * 60,   // Convert to minutes
    lq: lq,
    l: l,
    utilization: rho,
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
  const { lambda, mu, duration, s } = params;
  const clients: ClientEvent[] = [];
  let currentTime = 0;
  let clientId = 1;

  // Track the time each server becomes free
  const serversFreeAt = new Array(s).fill(0);

  // Simple Poisson arrival: Inter-arrival time ~ exponential(lambda/60)
  // Simple service time: Service duration ~ exponential(mu/60)
  
  while (currentTime < duration) {
    // Generate next arrival
    // Inter-arrival time = -ln(U) / (lambda/60)
    const interArrival = -Math.log(Math.random()) / (lambda / 60);
    currentTime += interArrival;
    
    if (currentTime > duration) break;

    // Service duration = -ln(U) / (mu/60)
    const serviceDuration = -Math.log(Math.random()) / (mu / 60);

    // Generate product count (Poisson-like distribution around 2.25)
    // For simplicity, using a random range between 1 and 4
    const productCount = Math.floor(Math.random() * 4) + 1;

    // Find the first available server
    let serverIndex = -1;
    let minFreeTime = Infinity;
    
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

    // If server is free before/at arrival, start now. 
    // Otherwise, start when server is free.
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
  
  return {
    ...mmsStats,
    totalProducts,
    clients,
  };
}
