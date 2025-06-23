import React from 'react';
import { Building2, Rocket, Zap } from 'lucide-react';
import { ClientType, UrgencyLevel } from '@/types/calculator/service-calculator.types';

interface ProjectConfigurationProps {
  clientType: ClientType;
  urgency: UrgencyLevel;
  onClientTypeChange: (type: ClientType) => void;
  onUrgencyChange: (urgency: UrgencyLevel) => void;
}

const clientTypeOptions = [
  {
    value: 'startup' as ClientType,
    label: 'Startup',
    description: '15% descuento',
    icon: <Rocket className="w-4 h-4" />,
    color: 'text-green-600'
  },
  {
    value: 'pyme' as ClientType,
    label: 'PyME',
    description: 'precio estándar',
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-blue-600'
  },
  {
    value: 'enterprise' as ClientType,
    label: 'Empresa',
    description: '10% premium',
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-purple-600'
  }
];

const urgencyOptions = [
  {
    value: 'normal' as UrgencyLevel,
    label: 'Normal',
    description: 'tiempo estándar',
    color: 'text-gray-600'
  },
  {
    value: 'express' as UrgencyLevel,
    label: 'Express',
    description: '+50%, -30% tiempo',
    color: 'text-orange-600'
  },
  {
    value: 'urgent' as UrgencyLevel,
    label: 'Urgente',
    description: '+100%, -50% tiempo',
    color: 'text-red-600'
  }
];

export const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  clientType,
  urgency,
  onClientTypeChange,
  onUrgencyChange
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Proyecto</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Cliente
          </label>
          <div className="space-y-2">
            {clientTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-300 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="clientType"
                  value={option.value}
                  checked={clientType === option.value}
                  onChange={(e) => onClientTypeChange(e.target.value as ClientType)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  clientType === option.value 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {clientType === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`mr-2 ${option.color}`}>{option.icon}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <span className="text-sm text-gray-500 ml-2">({option.description})</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nivel de Urgencia
          </label>
          <div className="space-y-2">
            {urgencyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white hover:border-blue-300 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={urgency === option.value}
                  onChange={(e) => onUrgencyChange(e.target.value as UrgencyLevel)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  urgency === option.value 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300'
                }`}>
                  {urgency === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <Zap className={`w-4 h-4 mr-2 ${option.color}`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <span className="text-sm text-gray-500 ml-2">({option.description})</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
