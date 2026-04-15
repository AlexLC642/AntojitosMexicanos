
import { create } from 'zustand';
import { SimulationParams, SimulationResult, simulate } from '@/lib/simulation';

interface Scenario {
  id: string;
  name: string;
  params: SimulationParams;
  result?: SimulationResult;
}

interface SimulationState {
  params: SimulationParams;
  result: SimulationResult | null;
  scenarios: Scenario[];
  isSimulating: boolean;
  
  // Actions
  setParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;
  setScenario: (id: string) => void;
  compareScenarios: () => void;
}

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
    
    // Operational Scenarios from README line 147
    { id: 'base', name: 'Escenario Base (Actual)', params: { lambda: 45, mu: 15, s: 3, duration: 120 } },
    { id: 'menos-personal', name: 'Escenario Menor Personal', params: { lambda: 45, mu: 15, s: 2, duration: 120 } },
    { id: 'mayor-personal', name: 'Escenario Mayor Personal', params: { lambda: 45, mu: 15, s: 4, duration: 120 } },
    { id: 'optimizado', name: 'Escenario Optimizado', params: { lambda: 45, mu: 20, s: 3, duration: 120 } },
  ],
  isSimulating: false,

  setParams: (newParams) => set((state) => ({ 
    params: { ...state.params, ...newParams } 
  })),

  runSimulation: () => {
    set({ isSimulating: true });
    // Small timeout to simulate processing
    setTimeout(() => {
      const { params } = get();
      const result = simulate(params);
      set({ result, isSimulating: false });
    }, 500);
  },

  setScenario: (id) => {
    const scenario = get().scenarios.find(s => s.id === id);
    if (scenario) {
      set({ params: scenario.params });
      get().runSimulation();
    }
  },

  compareScenarios: () => {
     const comparedScenarios = get().scenarios.map(s => ({
        ...s,
        result: simulate(s.params)
     }));
     set({ scenarios: comparedScenarios });
  }
}));
