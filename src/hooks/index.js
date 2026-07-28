// src/hooks/index.js
// Data Hooks
export { default as useMembers } from './useMembers';
export { default as useTrainers } from './useTrainers';
export { default as useClasses } from './useClasses';
export { default as usePayments } from './usePayments';
export { default as useDashboard } from './useDashboard';

// UI Hooks
export { default as useTheme } from './useTheme';
export { default as useSidebar } from './useSidebar';
export { default as useNotifications } from './useNotifications';
export { default as usePagination } from './usePagination';

// Utility Hooks
export { default as useDebounce } from './useDebounce';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useApi } from './useApi';
export { default as useAuth } from './useAuth';
export { default as useMembersQuery } from './useMembersQuery';

// Re-export all hooks as a single object
import * as hooks from './index';
export default hooks;