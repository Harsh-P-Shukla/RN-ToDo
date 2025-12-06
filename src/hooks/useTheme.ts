import {useAppStore} from '../store/useAppStore';
import {getTheme} from '../theme';

export const useTheme = () => {
  const mode = useAppStore(state => state.themeMode);
  return getTheme(mode);
};
