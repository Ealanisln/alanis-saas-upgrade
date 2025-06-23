import React from 'react';
import { Clock } from 'lucide-react';
import { ServiceCategory, ServiceOption } from '@/types/calculator/service-calculator.types';
import { quoteCalculator } from './quote-calculator';

interface ServiceCardProps {
  category: ServiceCategory;
  option: ServiceOption;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'basic': return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getComplexityLabel = (complexity: string): string => {
  switch (complexity) {
    case 'basic': return 'Básico';
    case 'intermediate': return 'Intermedio';
    case 'advanced': return 'Avanzado';
    default: return complexity;
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  category,
  option,
  quantity,
  onAdd,
  onRemove
}) => {
  const price = category.basePrice * option.priceMultiplier;
  const totalPrice = price * quantity;

  return (    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-lg">{option.name}</h4>
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getComplexityColor(option.complexity)}`}>
          {getComplexityLabel(option.complexity)}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{option.description}</p>
      
      {/* Features */}
      {option.features && option.features.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Incluye:</h5>
          <div className="flex flex-wrap gap-1">
            {option.features.map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {option.technologies && option.technologies.length > 0 && (
        <div className="mb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Tecnologías:</h5>
          <div className="flex flex-wrap gap-1">
            {option.technologies.map((tech, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {option.estimatedHours}h
        </span>
        <span className="font-semibold text-lg text-gray-900">
          {quoteCalculator.formatCurrency(price)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onRemove}
            disabled={quantity === 0}
            className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-gray-600"
            aria-label="Quitar servicio"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
          <button
            onClick={onAdd}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors font-medium shadow-sm"
            aria-label="Agregar servicio"
          >
            +
          </button>
        </div>
        
        {quantity > 0 && (
          <div className="text-right">
            <span className="text-sm font-semibold text-blue-600">
              {quoteCalculator.formatCurrency(totalPrice)}
            </span>
            {quantity > 1 && (
              <div className="text-xs text-gray-500">
                {quantity} × {quoteCalculator.formatCurrency(price)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
