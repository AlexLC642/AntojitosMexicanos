
import { create } from 'zustand';
import { SimulationParams, SimulationResult, simulate, Product } from '@/lib/simulation';

interface Scenario {
  id: string;
  name: string;
  params: SimulationParams;
  result?: SimulationResult;
}

interface Settings {
  distribution: 'exponential' | 'constant';
  themeColor: 'red' | 'green';
  maxRows: number;
}

interface SimulationState {
  params: SimulationParams;
  result: SimulationResult | null;
  scenarios: Scenario[];
  isSimulating: boolean;
  products: Product[];
  settings: Settings;
  
  // Actions
  setParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;
  resetResults: () => void;
  setScenario: (id: string) => void;
  compareScenarios: () => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  fetchProducts: () => Promise<void>;
  fetchScenarios: () => Promise<void>;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Hamburguesas', price: 25, category: 'Comida' },
  { id: '2', name: 'Burritos', price: 25, category: 'Comida' },
  { id: '3', name: 'Tacos (Orden)', price: 20, category: 'Comida' },
  { id: '4', name: 'Gringas', price: 20, category: 'Comida' },
  { id: '5', name: 'Poblanas', price: 20, category: 'Comida' },
  { id: '6', name: 'Hot dogs', price: 15, category: 'Comida' },
  { id: '7', name: 'Shucos', price: 15, category: 'Comida' },
  { id: '8', name: 'Coca-Cola', price: 10, category: 'Bebidas' },
  { id: '9', name: 'Fanta', price: 10, category: 'Bebidas' },
  { id: '10', name: 'Licuados', price: 12, category: 'Bebidas' },
  { id: '11', name: 'Té', price: 8, category: 'Bebidas' },
  { id: '12', name: 'Café', price: 8, category: 'Bebidas' },
];

const defaultParams: SimulationParams = {
  lambda: 40,
  mu: 15,
  s: 3,
  duration: 60,
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  params: defaultParams,
  result: null,
  scenarios: [
    { id: 'lunes', name: 'Lunes (Mañana)', params: { lambda: 25, mu: 12, s: 2, duration: 180 } },
    { id: 'martes', name: 'Martes (Mediodía)', params: { lambda: 38, mu: 14, s: 2, duration: 150 } },
    { id: 'miercoles', name: 'Miércoles (Pico Mañana)', params: { lambda: 53, mu: 15, s: 3, duration: 90 } },
    { id: 'viernes', name: 'Viernes (Pico Tarde)', params: { lambda: 65, mu: 18, s: 4, duration: 120 } },
    { id: 'sabado', name: 'Sábado (Pico Noche)', params: { lambda: 60, mu: 18, s: 4, duration: 120 } },
    { id: 'base', name: 'Escenario Base (Actual)', params: { lambda: 45, mu: 15, s: 3, duration: 120 } },
    { id: 'menos-personal', name: 'Escenario Menor Personal', params: { lambda: 45, mu: 15, s: 2, duration: 120 } },
    { id: 'mayor-personal', name: 'Escenario Mayor Personal', params: { lambda: 45, mu: 15, s: 4, duration: 120 } },
    { id: 'optimizado', name: 'Escenario Optimizado', params: { lambda: 45, mu: 20, s: 3, duration: 120 } },
  ],
  isSimulating: false,
  products: defaultProducts,
  settings: {
    distribution: 'exponential',
    themeColor: 'red',
    maxRows: 100,
  },

  setParams: (newParams) => set((state) => ({ 
    params: { ...state.params, ...newParams } 
  })),

  runSimulation: () => {
    set({ isSimulating: true });
    setTimeout(() => {
      const { params, products } = get();
      const result = simulate({ ...params, products });
      set({ result, isSimulating: false });
    }, 500);
  },

  resetResults: () => set({ result: null }),

  setScenario: (id) => {
    const scenario = get().scenarios.find(s => s.id === id);
    if (scenario) {
      set({ params: scenario.params });
      get().runSimulation();
    }
  },

  compareScenarios: () => {
     const { products } = get();
     const comparedScenarios = get().scenarios.map(s => ({
        ...s,
        result: simulate({ ...s.params, products })
     }));
     set({ scenarios: comparedScenarios });
  },

  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  fetchProducts: async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        set({ products });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  },

  fetchScenarios: async () => {
    try {
      const response = await fetch('/api/scenarios');
      if (response.ok) {
        const scenarios = await response.json();
        set({ scenarios });
      }
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    }
  }
}));
