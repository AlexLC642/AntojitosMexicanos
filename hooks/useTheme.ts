
import { useSimulationStore } from '@/store/useSimulationStore';

export function useTheme() {
  const themeColor = useSimulationStore(state => state.settings.themeColor);
  
  const isRed = themeColor === 'red';
  const isGreen = themeColor === 'green';

  return {
    themeColor,
    isRed,
    isGreen,
    // Backgrounds
    bgPrimary: isRed ? 'bg-red-600' : 'bg-green-600',
    bgPrimaryHover: isRed ? 'hover:bg-red-700' : 'hover:bg-green-700',
    bgPrimaryLight: isRed ? 'bg-red-600/10' : 'bg-green-600/10',
    
    // Text
    textPrimary: isRed ? 'text-red-500' : 'text-green-500',
    textPrimaryHover: isRed ? 'hover:text-red-500' : 'hover:text-green-500',
    
    // Border
    borderPrimary: isRed ? 'border-red-600' : 'border-green-600',
    borderPrimaryFocus: isRed ? 'focus:ring-red-600' : 'focus:ring-green-600',
    
    // Shadow/Glow
    glowPrimary: isRed ? 'shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  };
}
