#!/bin/bash

echo "🚀 Configurando la calculadora de servicios..."

# 1. Generar migración de Prisma
echo "📊 Generando migración de base de datos..."
npx prisma migrate dev --name add-quote-calculator-model

# 2. Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# 3. Verificar que no haya errores de TypeScript
echo "🔍 Verificando tipos TypeScript..."
npx tsc --noEmit

# 4. Mostrar rutas disponibles
echo "✅ ¡Configuración completada!"
echo ""
echo "📍 Rutas disponibles:"
echo "   - Cotizador: http://localhost:3000/cotizador"
echo "   - API Quotes: http://localhost:3000/api/quotes"
echo ""
echo "🛠 Comandos útiles:"
echo "   npm run dev          # Iniciar servidor de desarrollo"
echo "   npx prisma studio    # Ver base de datos"
echo "   npx prisma migrate reset  # Resetear base de datos"
echo ""
echo "📚 Documentación completa en: src/components/Calculator/README.md"
