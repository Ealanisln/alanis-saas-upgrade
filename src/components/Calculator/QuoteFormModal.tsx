"use client";

import React, { useState } from "react";
import { X, User, Mail, FileText } from "lucide-react";
import {
  QuoteRequest,
  QuoteCalculation,
  SelectedService,
} from "@/types/calculator/service-calculator.types";

interface QuoteFormModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmit: (request: QuoteRequest) => Promise<void>;
  quote: QuoteCalculation;
  services: SelectedService[];
  clientType: string;
  urgency: string;
  loading?: boolean;
}

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  isOpen,
  onCloseAction,
  onSubmit,
  quote,
  services,
  clientType,
  urgency,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    description: "",
    deadline: "",
    budget: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "El presupuesto debe ser un número";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const request: QuoteRequest = {
      services,
      clientType: clientType as QuoteRequest["clientType"],
      urgency: urgency as QuoteRequest["urgency"],
      clientInfo: {
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
      },
      projectDetails: {
        description: formData.description || undefined,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        requirements: formData.requirements
          ? formData.requirements.split("\n").filter((req) => req.trim())
          : undefined,
      },
    };

    await onSubmit(request);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
        <div className="sticky top-0 flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitar Cotización Formal
          </h2>
          <button
            onClick={onCloseAction}
            className="text-gray-400 transition-colors hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Quote Summary */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              Resumen de tu cotización
            </h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p>
                Total:{" "}
                <span className="font-semibold">
                  ${quote.total.toLocaleString("es-MX")} MXN
                </span>
              </p>
              <p>
                Tiempo estimado: {quote.estimatedDelivery} semana
                {quote.estimatedDelivery !== 1 ? "s" : ""}
              </p>
              <p>Horas totales: {quote.totalHours}h</p>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5" />
              Información de Contacto
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="quote-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre completo *
                </label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quote-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  id="quote-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quote-company"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Empresa
                </label>
                <input
                  id="quote-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="+52 55 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              Detalles del Proyecto
            </h3>

            <div>
              <label
                htmlFor="quote-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Descripción del proyecto
              </label>
              <textarea
                id="quote-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu proyecto, objetivos y cualquier detalle importante..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="quote-deadline"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Fecha límite deseada
                </label>
                <input
                  id="quote-deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-budget"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Presupuesto aproximado (MXN)
                </label>
                <input
                  id="quote-budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.budget ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="50000"
                />
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-500">{errors.budget}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-requirements"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Requerimientos específicos
              </label>
              <textarea
                id="quote-requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Un requerimiento por línea&#10;Ejemplo: Integración con API de pagos&#10;Soporte para múltiples idiomas"
              />
              <p className="mt-1 text-xs text-gray-500">
                Escribe cada requerimiento en una línea separada
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onCloseAction}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
