import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { EmailRequest, ApiResponse, EmailResponse } from '@/lib/api/types';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Validation schema
const SendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  template: z.string().optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(),
    contentType: z.string()
  })).optional()
});

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<EmailResponse>>> {
  try {
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Email service not configured',
        data: null
      }, { status: 500 });
    }

    const body = await request.json();
    const validatedData = SendEmailSchema.parse(body);

    // Prepare email message
    const msg = {
      to: validatedData.to,
      from: process.env.FROM_EMAIL || 'noreply@alaniswebdev.com',
      subject: validatedData.subject,
      text: validatedData.content,
      html: validatedData.content,
      attachments: validatedData.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        type: att.contentType,
        disposition: 'attachment'
      }))
    };

    // Send email
    const response = await sgMail.send(msg);
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: response[0].headers['x-message-id'] || 'unknown',
        status: 'sent'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email data',
        data: {
          messageId: '',
          status: 'failed',
          error: 'Validation failed'
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send email',
      data: {
        messageId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// GET method for testing endpoint health
export async function GET(): Promise<NextResponse<ApiResponse<{ status: string }>>> {
  return NextResponse.json({
    success: true,
    message: 'Email API endpoint is working',
    data: { status: 'healthy' }
  });
} 