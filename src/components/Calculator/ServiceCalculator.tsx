'use client';

import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { 
  SelectedService, 
  ClientType, 
  UrgencyLevel, 
  QuoteCalculation,
  QuoteRequest 
} from '@/types/calculator/service-calculator.types';
import { ProjectConfiguration } from './ProjectConfiguration';
import { quoteCalculator } from './quote-calculator';
import { QuoteFormModal } from './QuoteFormModal';
import { QuoteSummary } from './QuoteSummary';
import { serviceCategories } from './service-config';
import { ServiceCard } from './ServiceCard';

const ServiceCalculator: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [clientType, setClientType] = useState<ClientType>('pyme');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [quote, setQuote] = useState<QuoteCalculation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { createQuote, loading: creatingQuote, error: quoteError, clearError } = useQuotes();

  // Calculate quote whenever dependencies change
  useEffect(() => {
    const newQuote = quoteCalculator.calculateQuote(selectedServices, clientType, urgency);
    setQuote(newQuote.total > 0 ? newQuote : null);
  }, [selectedServices, clientType, urgency]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const addService = (categoryId: string, optionId: string): void => {
    const existingIndex = selectedServices.findIndex(
      s => s.categoryId === categoryId && s.optionId === optionId
    );

    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      setSelectedServices(updated);
    } else {
      setSelectedServices(prev => [...prev, { categoryId, optionId, quantity: 1 }]);
    }
  };

  const removeService = (categoryId: string, optionId: string): void => {
    const existingIndex = selectedServices.findIndex(
      s => s.categoryId === categoryId && s.optionId === optionId
    );

    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity - 1
        };
      } else {
        updated.splice(existingIndex, 1);
      }
      setSelectedServices(updated);
    }
  };

  const getServiceQuantity = (categoryId: string, optionId: string): number => {
    const service = selectedServices.find(
      s => s.categoryId === categoryId && s.optionId === optionId
    );
    return service?.quantity || 0;
  };

  const handleQuoteRequest = (): void => {
    if (!quote || selectedServices.length === 0) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (request: QuoteRequest): Promise<void> => {
    const result = await createQuote(request);
    
    if (result) {
      setIsModalOpen(false);
      setSuccessMessage('¡Cotización enviada exitosamente! Te contactaremos pronto.');
      // Reset form
      setSelectedServices([]);
      clearError();
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    clearError();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" />
          Cotizador de Servicios
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Calcula el costo de tu proyecto de desarrollo web, diseño UI/UX y marketing digital
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Display */}
      {quoteError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{quoteError}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Services Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Configuration */}
          <ProjectConfiguration
            clientType={clientType}
            urgency={urgency}
            onClientTypeChange={setClientType}
            onUrgencyChange={setUrgency}
          />

          {/* Service Categories */}
          {serviceCategories.map(category => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-blue-600">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <span className="text-sm font-medium text-blue-600">
                    desde {quoteCalculator.formatCurrency(category.basePrice)}
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {category.options.map(option => (
                  <ServiceCard
                    key={option.id}
                    category={category}
                    option={option}
                    quantity={getServiceQuantity(category.id, option.id)}
                    onAdd={() => addService(category.id, option.id)}
                    onRemove={() => removeService(category.id, option.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quote Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <QuoteSummary
              quote={quote}
              onRequestQuote={handleQuoteRequest}
            />
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      {quote && (
        <QuoteFormModal
          isOpen={isModalOpen}
          onCloseAction={handleModalClose}
          onSubmit={handleModalSubmit}
          quote={quote}
          services={selectedServices}
          clientType={clientType}
          urgency={urgency}
          loading={creatingQuote}
        />
      )}
    </div>
  );
};

export default ServiceCalculator;
