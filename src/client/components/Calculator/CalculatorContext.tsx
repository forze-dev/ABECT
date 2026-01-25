'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface ProjectType {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  hasWebliumOption: boolean;
  webliumBasePrice?: number;
  customBasePrice: number;
  order?: number;
}

export interface AdditionalService {
  slug: string;
  name: string;
  description?: string;
  price: number;
  icon?: string;
  order?: number;
}

export interface UrgencyOption {
  slug: string;
  name: string;
  description?: string;
  coefficient: number;
  timelineText?: string;
  order?: number;
}

export interface CalculatorConfig {
  projectTypes: ProjectType[];
  pagesConfig: {
    webliumPricePerPage: number;
    customPricePerPage: number;
    minPages: number;
    maxPages: number;
    defaultPages: number;
  };
  additionalServices: AdditionalService[];
  urgencyOptions: UrgencyOption[];
  generalSettings: {
    currency: string;
    showPriceFrom: boolean;
    minimumOrderPrice: number;
  };
}

export interface CalculatorState {
  // Config
  config: CalculatorConfig | null;
  configLoading: boolean;
  configError: string | null;

  // Steps
  currentStep: number;
  totalSteps: number;

  // Selected values
  projectType: string | null;
  platform: 'weblium' | 'custom' | null;
  pagesCount: number;
  additionalServices: string[];
  urgency: string | null;

  // Contact data
  name: string;
  contact: string;
  message: string;

  // Calculated values
  estimatedPrice: number;
  estimatedTimeline: string;

  // Form state
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

type CalculatorAction =
  | { type: 'SET_CONFIG'; payload: CalculatorConfig }
  | { type: 'SET_CONFIG_LOADING'; payload: boolean }
  | { type: 'SET_CONFIG_ERROR'; payload: string | null }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PROJECT_TYPE'; payload: string }
  | { type: 'SET_PLATFORM'; payload: 'weblium' | 'custom' }
  | { type: 'SET_PAGES_COUNT'; payload: number }
  | { type: 'TOGGLE_SERVICE'; payload: string }
  | { type: 'SET_URGENCY'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CONTACT'; payload: string }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string | null }
  | { type: 'SET_SUBMIT_SUCCESS'; payload: boolean }
  | { type: 'RESET' };

const STORAGE_KEY = 'abect-calculator-state';

const initialState: CalculatorState = {
  config: null,
  configLoading: true,
  configError: null,
  currentStep: 0,
  totalSteps: 6,
  projectType: null,
  platform: null,
  pagesCount: 5,
  additionalServices: [],
  urgency: null,
  name: '',
  contact: '',
  message: '',
  estimatedPrice: 0,
  estimatedTimeline: '',
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
};

/**
 * Calculate price based on selections
 */
function calculatePrice(state: CalculatorState): number {
  const { config, projectType, platform, pagesCount, additionalServices, urgency } = state;

  if (!config || !projectType || !platform) return 0;

  const selectedProject = config.projectTypes.find((p) => p.slug === projectType);
  if (!selectedProject) return 0;

  // Base price
  let price =
    platform === 'weblium'
      ? selectedProject.webliumBasePrice || selectedProject.customBasePrice * 0.6
      : selectedProject.customBasePrice;

  // Price per page
  const pricePerPage =
    platform === 'weblium'
      ? config.pagesConfig.webliumPricePerPage
      : config.pagesConfig.customPricePerPage;

  // Add pages (subtract 1 as base price includes 1 page)
  const extraPages = Math.max(0, pagesCount - 1);
  price += extraPages * pricePerPage;

  // Add additional services
  additionalServices.forEach((serviceSlug) => {
    const service = config.additionalServices.find((s) => s.slug === serviceSlug);
    if (service) {
      price += service.price;
    }
  });

  // Apply urgency coefficient
  if (urgency) {
    const urgencyOption = config.urgencyOptions.find((u) => u.slug === urgency);
    if (urgencyOption) {
      price *= urgencyOption.coefficient;
    }
  }

  // Minimum order price
  price = Math.max(price, config.generalSettings.minimumOrderPrice);

  return Math.round(price);
}

/**
 * Calculate estimated timeline
 */
function calculateTimeline(state: CalculatorState): string {
  const { config, urgency } = state;

  if (!config || !urgency) return '';

  const urgencyOption = config.urgencyOptions.find((u) => u.slug === urgency);
  return urgencyOption?.timelineText || '';
}

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  let newState: CalculatorState;

  switch (action.type) {
    case 'SET_CONFIG':
      newState = {
        ...state,
        config: action.payload,
        configLoading: false,
        pagesCount: action.payload.pagesConfig.defaultPages,
      };
      break;

    case 'SET_CONFIG_LOADING':
      newState = { ...state, configLoading: action.payload };
      break;

    case 'SET_CONFIG_ERROR':
      newState = { ...state, configError: action.payload, configLoading: false };
      break;

    case 'SET_STEP':
      newState = { ...state, currentStep: action.payload };
      break;

    case 'NEXT_STEP':
      newState = { ...state, currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) };
      break;

    case 'PREV_STEP':
      newState = { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
      break;

    case 'SET_PROJECT_TYPE':
      // Reset platform if project doesn't support Weblium
      const project = state.config?.projectTypes.find((p) => p.slug === action.payload);
      newState = {
        ...state,
        projectType: action.payload,
        platform: project?.hasWebliumOption ? state.platform : 'custom',
      };
      break;

    case 'SET_PLATFORM':
      newState = { ...state, platform: action.payload };
      break;

    case 'SET_PAGES_COUNT':
      newState = { ...state, pagesCount: action.payload };
      break;

    case 'TOGGLE_SERVICE':
      const services = state.additionalServices.includes(action.payload)
        ? state.additionalServices.filter((s) => s !== action.payload)
        : [...state.additionalServices, action.payload];
      newState = { ...state, additionalServices: services };
      break;

    case 'SET_URGENCY':
      newState = { ...state, urgency: action.payload };
      break;

    case 'SET_NAME':
      newState = { ...state, name: action.payload };
      break;

    case 'SET_CONTACT':
      newState = { ...state, contact: action.payload };
      break;

    case 'SET_MESSAGE':
      newState = { ...state, message: action.payload };
      break;

    case 'SET_SUBMITTING':
      newState = { ...state, isSubmitting: action.payload };
      break;

    case 'SET_SUBMIT_ERROR':
      newState = { ...state, submitError: action.payload };
      break;

    case 'SET_SUBMIT_SUCCESS':
      newState = { ...state, submitSuccess: action.payload };
      break;

    case 'RESET':
      newState = {
        ...initialState,
        config: state.config,
        configLoading: false,
        pagesCount: state.config?.pagesConfig.defaultPages || 5,
      };
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      return newState;

    default:
      return state;
  }

  // Recalculate price and timeline
  newState.estimatedPrice = calculatePrice(newState);
  newState.estimatedTimeline = calculateTimeline(newState);

  return newState;
}

// Context
interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
  // Helper functions
  nextStep: () => void;
  prevStep: () => void;
  setProjectType: (type: string) => void;
  setPlatform: (platform: 'weblium' | 'custom') => void;
  setPagesCount: (count: number) => void;
  toggleService: (service: string) => void;
  setUrgency: (urgency: string) => void;
  setName: (name: string) => void;
  setContact: (contact: string) => void;
  setMessage: (message: string) => void;
  reset: () => void;
  canProceed: () => boolean;
  getSelectedProjectType: () => ProjectType | undefined;
  getSelectedUrgency: () => UrgencyOption | undefined;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

// Provider
interface CalculatorProviderProps {
  children: ReactNode;
  initialConfig?: CalculatorConfig;
}

export function CalculatorProvider({ children, initialConfig }: CalculatorProviderProps) {
  const [state, dispatch] = useReducer(calculatorReducer, {
    ...initialState,
    config: initialConfig || null,
    configLoading: !initialConfig,
  });

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore only user selections, not config or form state
        if (parsed.projectType) dispatch({ type: 'SET_PROJECT_TYPE', payload: parsed.projectType });
        if (parsed.platform) dispatch({ type: 'SET_PLATFORM', payload: parsed.platform });
        if (parsed.pagesCount) dispatch({ type: 'SET_PAGES_COUNT', payload: parsed.pagesCount });
        if (parsed.additionalServices) {
          parsed.additionalServices.forEach((s: string) => {
            dispatch({ type: 'TOGGLE_SERVICE', payload: s });
          });
        }
        if (parsed.urgency) dispatch({ type: 'SET_URGENCY', payload: parsed.urgency });
        if (parsed.currentStep) dispatch({ type: 'SET_STEP', payload: parsed.currentStep });
      } catch (e) {
        console.error('Failed to parse saved calculator state:', e);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined' || state.submitSuccess) return;

    const toSave = {
      currentStep: state.currentStep,
      projectType: state.projectType,
      platform: state.platform,
      pagesCount: state.pagesCount,
      additionalServices: state.additionalServices,
      urgency: state.urgency,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [
    state.currentStep,
    state.projectType,
    state.platform,
    state.pagesCount,
    state.additionalServices,
    state.urgency,
    state.submitSuccess,
  ]);

  // Helper functions
  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  const setProjectType = (type: string) => dispatch({ type: 'SET_PROJECT_TYPE', payload: type });
  const setPlatform = (platform: 'weblium' | 'custom') =>
    dispatch({ type: 'SET_PLATFORM', payload: platform });
  const setPagesCount = (count: number) => dispatch({ type: 'SET_PAGES_COUNT', payload: count });
  const toggleService = (service: string) => dispatch({ type: 'TOGGLE_SERVICE', payload: service });
  const setUrgency = (urgency: string) => dispatch({ type: 'SET_URGENCY', payload: urgency });
  const setName = (name: string) => dispatch({ type: 'SET_NAME', payload: name });
  const setContact = (contact: string) => dispatch({ type: 'SET_CONTACT', payload: contact });
  const setMessage = (message: string) => dispatch({ type: 'SET_MESSAGE', payload: message });
  const reset = () => dispatch({ type: 'RESET' });

  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 0: // Project type
        return !!state.projectType;
      case 1: // Platform
        return !!state.platform;
      case 2: // Pages
        return state.pagesCount > 0;
      case 3: // Additional services
        return true; // Optional step
      case 4: // Urgency
        return !!state.urgency;
      case 5: // Contact
        return state.name.trim().length >= 2 && state.contact.trim().length > 0;
      default:
        return false;
    }
  };

  const getSelectedProjectType = () =>
    state.config?.projectTypes.find((p) => p.slug === state.projectType);

  const getSelectedUrgency = () =>
    state.config?.urgencyOptions.find((u) => u.slug === state.urgency);

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        setProjectType,
        setPlatform,
        setPagesCount,
        toggleService,
        setUrgency,
        setName,
        setContact,
        setMessage,
        reset,
        canProceed,
        getSelectedProjectType,
        getSelectedUrgency,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
