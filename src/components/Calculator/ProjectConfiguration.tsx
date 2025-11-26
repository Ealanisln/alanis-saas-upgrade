import React from "react";
import { Building2, Rocket, Zap } from "lucide-react";
import {
  ClientType,
  UrgencyLevel,
} from "@/types/calculator/service-calculator.types";

interface ProjectConfigurationProps {
  clientType: ClientType;
  urgency: UrgencyLevel;
  onClientTypeChange: (type: ClientType) => void;
  onUrgencyChange: (urgency: UrgencyLevel) => void;
}

const clientTypeOptions = [
  {
    value: "startup" as ClientType,
    label: "Startup",
    description: "15% descuento",
    icon: <Rocket className="h-4 w-4" />,
    color: "text-green-600",
  },
  {
    value: "pyme" as ClientType,
    label: "PyME",
    description: "precio estándar",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-blue-600",
  },
  {
    value: "enterprise" as ClientType,
    label: "Empresa",
    description: "10% premium",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-purple-600",
  },
];

const urgencyOptions = [
  {
    value: "normal" as UrgencyLevel,
    label: "Normal",
    description: "tiempo estándar",
    color: "text-gray-600",
  },
  {
    value: "express" as UrgencyLevel,
    label: "Express",
    description: "+50%, -30% tiempo",
    color: "text-orange-600",
  },
  {
    value: "urgent" as UrgencyLevel,
    label: "Urgente",
    description: "+100%, -50% tiempo",
    color: "text-red-600",
  },
];

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  clientType,
  urgency,
  onClientTypeChange,
  onUrgencyChange,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        Configuración del Proyecto
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Type */}
        <div role="radiogroup" aria-labelledby="client-type-label">
          <span
            id="client-type-label"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Tipo de Cliente
          </span>
          <div className="space-y-2">
            {clientTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:bg-white"
              >
                <input
                  type="radio"
                  name="clientType"
                  value={option.value}
                  checked={clientType === option.value}
                  onChange={(e) =>
                    onClientTypeChange(e.target.value as ClientType)
                  }
                  className="sr-only"
                />
                <div
                  className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    clientType === option.value
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {clientType === option.value && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className={`mr-2 ${option.color}`}>{option.icon}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({option.description})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div role="radiogroup" aria-labelledby="urgency-label">
          <span
            id="urgency-label"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Nivel de Urgencia
          </span>
          <div className="space-y-2">
            {urgencyOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:bg-white"
              >
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={urgency === option.value}
                  onChange={(e) =>
                    onUrgencyChange(e.target.value as UrgencyLevel)
                  }
                  className="sr-only"
                />
                <div
                  className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    urgency === option.value
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  {urgency === option.value && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <Zap className={`mr-2 h-4 w-4 ${option.color}`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({option.description})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
