import React from 'react';
import { Star, Users, Clock, Zap, Send } from 'lucide-react';
import { QuoteCalculation } from '@/types/calculator/service-calculator.types';
import { quoteCalculator } from './quote-calculator';

interface QuoteSummaryProps {
  quote: QuoteCalculation | null;
  onRequestQuote: () => void;
}

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote, onRequestQuote }) => {
  if (!quote) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Resumen de Cotización
        </h3>
        
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 leading-relaxed">
            Selecciona los servicios que necesitas para generar tu cotización personalizada
          </p>
        </div>
      </div>
    );
  }

  const hasDiscount = quote.discounts !== 0;
  const isDiscount = quote.discounts > 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Resumen de Cotización
      </h3>
      
      <div className="space-y-6">
        {/* Price Breakdown */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{quoteCalculator.formatCurrency(quote.subtotal)}</span>
          </div>
          
          {hasDiscount && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {isDiscount ? 'Descuento:' : 'Cargo premium:'}
              </span>
              <span className={`font-medium ${isDiscount ? 'text-green-600' : 'text-red-600'}`}>
                {isDiscount ? '-' : '+'}{quoteCalculator.formatCurrency(Math.abs(quote.discounts))}
              </span>
            </div>
          )}
          
          {quote.urgencyMultiplier > 1 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cargo por urgencia:</span>
              <span className="font-medium text-orange-600">
                +{quoteCalculator.formatPercentage(quote.urgencyMultiplier - 1)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (16%):</span>
            <span className="font-medium">{quoteCalculator.formatCurrency(quote.taxes)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {quoteCalculator.formatCurrency(quote.total)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              Tiempo estimado:
            </span>
            <span className="font-semibold text-gray-900">
              {quote.estimatedDelivery} semana{quote.estimatedDelivery !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Zap className="w-4 h-4" />
              Horas totales:
            </span>
            <span className="font-semibold text-gray-900">{quote.totalHours}h</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Costo por hora:</span>
            <span className="font-semibold text-gray-900">
              {quoteCalculator.formatCurrency(quote.total / quote.totalHours)}
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={onRequestQuote}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Send className="w-5 h-5" />
          Solicitar Cotización Formal
        </button>
        
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          * Los precios son estimativos y pueden variar según los requerimientos específicos del proyecto
        </p>
      </div>
    </div>
  );
};
