import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { 
  CreateQuoteResponse, 
  ListQuotesResponse,
  ClientType,
  UrgencyLevel 
} from '@/types/calculator/service-calculator.types';

// Validation schemas
const SelectedServiceSchema = z.object({
  categoryId: z.string(),
  optionId: z.string(),
  quantity: z.number().min(1)
});

const CreateQuoteSchema = z.object({
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientCompany: z.string().optional(),
  clientPhone: z.string().optional(),
  clientType: z.enum(['startup', 'pyme', 'enterprise']),
  urgency: z.enum(['normal', 'express', 'urgent']),
  services: z.array(SelectedServiceSchema).min(1),
  subtotal: z.number().min(0),
  discounts: z.number(),
  taxes: z.number().min(0),
  total: z.number().min(0),
  estimatedDelivery: z.number().min(1),
  totalHours: z.number().min(1),
  projectDescription: z.string().optional(),
  deadline: z.string().datetime().optional(),
  budget: z.number().optional(),
  requirements: z.array(z.string()).optional()
});

// GET /api/quotes - List quotes with pagination
export async function GET(request: NextRequest): Promise<NextResponse<ListQuotesResponse>> {
  try {    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const clientType = searchParams.get('clientType') as ClientType | null;

    const where = {
      ...(status && { status }),
      ...(clientType && { clientType })
    };

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quote.count({ where })
    ]);

    const transformedQuotes = quotes.map(quote => ({
      id: quote.id,
      calculation: {
        subtotal: quote.subtotal,
        discounts: quote.discounts,
        taxes: quote.taxes,
        total: quote.total,
        estimatedDelivery: quote.estimatedDelivery,
        totalHours: quote.totalHours,
        urgencyMultiplier: 1, // Calculate if needed
        discountRate: 0 // Calculate if needed
      },
      request: {
        services: quote.services as any,
        clientType: quote.clientType as ClientType,
        urgency: quote.urgency as UrgencyLevel,
        clientInfo: {
          name: quote.clientName,
          email: quote.clientEmail,
          company: quote.clientCompany,
          phone: quote.clientPhone
        },
        projectDetails: {
          description: quote.projectDescription,
          deadline: quote.deadline,
          budget: quote.budget,
          requirements: quote.requirements as string[]
        }
      },
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      status: quote.status as any
    }));

    return NextResponse.json({
      success: true,
      data: transformedQuotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST /api/quotes - Create new quote
export async function POST(request: NextRequest): Promise<NextResponse<CreateQuoteResponse>> {
  try {
    const body = await request.json();
    const validatedData = CreateQuoteSchema.parse(body);

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

    const quote = await prisma.quote.create({
      data: {
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientCompany: validatedData.clientCompany,
        clientPhone: validatedData.clientPhone,
        clientType: validatedData.clientType,
        urgency: validatedData.urgency,
        services: validatedData.services as any,
        subtotal: validatedData.subtotal,
        discounts: validatedData.discounts,
        taxes: validatedData.taxes,
        total: validatedData.total,
        estimatedDelivery: validatedData.estimatedDelivery,
        totalHours: validatedData.totalHours,
        projectDescription: validatedData.projectDescription,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        budget: validatedData.budget,
        requirements: validatedData.requirements || [],
        status: 'draft',
        validUntil,
      }
    });

    const response = {
      id: quote.id,
      calculation: {
        subtotal: quote.subtotal,
        discounts: quote.discounts,
        taxes: quote.taxes,
        total: quote.total,
        estimatedDelivery: quote.estimatedDelivery,
        totalHours: quote.totalHours,
        urgencyMultiplier: 1,
        discountRate: 0
      },
      request: {
        services: quote.services as any,
        clientType: quote.clientType as ClientType,
        urgency: quote.urgency as UrgencyLevel,
        clientInfo: {
          name: quote.clientName,
          email: quote.clientEmail,
          company: quote.clientCompany,
          phone: quote.clientPhone
        },
        projectDetails: {
          description: quote.projectDescription,
          deadline: quote.deadline,
          budget: quote.budget,
          requirements: quote.requirements as string[]
        }
      },
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      status: quote.status as any
    };

    return NextResponse.json({
      success: true,
      data: response
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Error creating quote:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
