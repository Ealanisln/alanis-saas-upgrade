// Re-export all calculator components
export { default as ServiceCalculator } from './ServiceCalculator';
export { ServiceCard } from './ServiceCard';
export { QuoteSummary } from './QuoteSummary';
export { ProjectConfiguration } from './ProjectConfiguration';
export { QuoteFormModal } from './QuoteFormModal';
export { quoteCalculator } from './quote-calculator';
export { serviceCategories } from './service-config';

// Re-export types
export type {
  ServiceCategory,
  ServiceOption,
  SelectedService,
  QuoteCalculation,
  ClientType,
  UrgencyLevel,
  QuoteRequest,
  QuoteResponse
} from '@/types/calculator/service-calculator.types';
