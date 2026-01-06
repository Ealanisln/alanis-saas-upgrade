"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Calculator } from "lucide-react";
import { submitQuoteRequest } from "@/app/actions/quote";
import {
  SelectedService,
  ClientType,
  UrgencyLevel,
  QuoteCalculation,
  QuoteRequest,
} from "@/types/calculator/service-calculator.types";
import { ProjectConfiguration } from "./ProjectConfiguration";
import { quoteCalculator } from "./quote-calculator";
import { QuoteFormModal } from "./QuoteFormModal";
import { QuoteSummary } from "./QuoteSummary";
import { serviceCategories } from "./service-config";
import { ServiceCard } from "./ServiceCard";

const ServiceCalculator: React.FC = () => {
  const locale = useLocale() as "en" | "es";
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    [],
  );
  const [clientType, setClientType] = useState<ClientType>("pyme");
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [quote, setQuote] = useState<QuoteCalculation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [creatingQuote, setCreatingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const clearError = () => setQuoteError(null);

  // Calculate quote whenever dependencies change
  useEffect(() => {
    const newQuote = quoteCalculator.calculateQuote(
      selectedServices,
      clientType,
      urgency,
    );
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
      (s) => s.categoryId === categoryId && s.optionId === optionId,
    );

    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      setSelectedServices(updated);
    } else {
      setSelectedServices((prev) => [
        ...prev,
        { categoryId, optionId, quantity: 1 },
      ]);
    }
  };

  const removeService = (categoryId: string, optionId: string): void => {
    const existingIndex = selectedServices.findIndex(
      (s) => s.categoryId === categoryId && s.optionId === optionId,
    );

    if (existingIndex >= 0) {
      const updated = [...selectedServices];

      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity - 1,
        };
      } else {
        updated.splice(existingIndex, 1);
      }
      setSelectedServices(updated);
    }
  };

  const getServiceQuantity = (categoryId: string, optionId: string): number => {
    const service = selectedServices.find(
      (s) => s.categoryId === categoryId && s.optionId === optionId,
    );
    return service?.quantity || 0;
  };

  const handleQuoteRequest = (): void => {
    if (!quote || selectedServices.length === 0) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    request: QuoteRequest,
    turnstileToken?: string,
  ): Promise<void> => {
    setCreatingQuote(true);
    setQuoteError(null);

    try {
      // Get service details for email
      const serviceDetails = request.services.map((s) => {
        const category = serviceCategories.find((c) => c.id === s.categoryId);
        const option = category?.options.find((o) => o.id === s.optionId);
        const unitPrice =
          (category?.basePrice || 0) * (option?.priceMultiplier || 0);
        return {
          name: option?.name || s.optionId,
          price: unitPrice * s.quantity,
        };
      });

      const result = await submitQuoteRequest(
        {
          name: request.clientInfo?.name || "",
          email: request.clientInfo?.email || "",
          phone: request.clientInfo?.phone,
          company: request.clientInfo?.company,
          services: serviceDetails,
          totalAmount: quote?.total || 0,
          clientType: request.clientType,
          urgency: request.urgency,
          notes: request.projectDetails?.description,
          locale,
        },
        turnstileToken,
      );

      if (result.success) {
        setIsModalOpen(false);
        setSuccessMessage(
          "¡Cotización enviada exitosamente! Te contactaremos pronto.",
        );
        // Reset form
        setSelectedServices([]);
        clearError();
      } else {
        setQuoteError(result.message);
      }
    } catch (error) {
      setQuoteError(
        error instanceof Error ? error.message : "Error al enviar cotización",
      );
    } finally {
      setCreatingQuote(false);
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    clearError();
  };

  return (
    <div className="mx-auto max-w-7xl bg-white p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-900">
          <Calculator className="h-10 w-10 text-blue-600" />
          Cotizador de Servicios
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Calcula el costo de tu proyecto de desarrollo web, diseño UI/UX y
          marketing digital
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Display */}
      {quoteError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{quoteError}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Services Selection */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project Configuration */}
          <ProjectConfiguration
            clientType={clientType}
            urgency={urgency}
            onClientTypeChange={setClientType}
            onUrgencyChange={setUrgency}
          />

          {/* Service Categories */}
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-blue-600">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                  <span className="text-sm font-medium text-blue-600">
                    desde {quoteCalculator.formatCurrency(category.basePrice)}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {category.options.map((option) => (
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
            <QuoteSummary quote={quote} onRequestQuote={handleQuoteRequest} />
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
