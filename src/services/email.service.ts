import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

type OrderSummary = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status?: string;
};

class EmailService {
  private static transporter: Transporter | null = null;
  private static initialized = false;

  static init() {
    if (this.initialized) return;
    this.initialized = true;

    if (process.env.EMAIL_DISABLED === 'true') {
      this.transporter = null;
      return;
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.warn('EmailService: SMTP credentials missing — emails disabled');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  static async sendMail(to: string, subject: string, html: string) {
    this.init();
    if (!this.transporter) {
      // email disabled — log and return
      console.info('EmailService: email sending disabled — would send to', to, subject);
      return { accepted: [], info: 'disabled' };
    }
    const from = process.env.EMAIL_FROM || 'no-reply@example.com';
    const info = await this.transporter.sendMail({ from, to, subject, html });
    return info;
  }

  static loadTemplate(filename: string, replacements: Record<string, string | number>) {
    const p = path.join(__dirname, '..', 'templates', filename);
    try {
      let html = fs.readFileSync(p, 'utf8');
      for (const [k, v] of Object.entries(replacements)) {
        html = html.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
      return html;
    } catch (e) {
      return '';
    }
  }

  static async sendOrderConfirmation(order: OrderSummary) {
    const subject = `Order Confirmed — ${order.id}`;
    const itemsHtml = order.items.map(i =>
      `<li>${i.name} × ${i.quantity} — ${i.lineTotal.toFixed(2)}</li>`).join('');
    const html = this.loadTemplate('order-confirmation.html', {
      orderId: order.id,
      customerName: order.customerName,
      items: itemsHtml,
      subtotal: order.subtotal.toFixed(2),
      tax: order.tax.toFixed(2),
      shipping: order.shipping.toFixed(2),
      total: order.total.toFixed(2),
    });
    return this.sendMail(order.customerEmail, subject, html || `<p>Order ${order.id} confirmed</p>`);
  }

  static async sendOrderStatusUpdate(order: OrderSummary) {
    const subject = `Order ${order.id} — ${order.status}`;
    const html = this.loadTemplate('order-status.html', {
      orderId: order.id,
      customerName: order.customerName,
      status: order.status || 'updated',
      total: order.total.toFixed(2),
    });
    return this.sendMail(order.customerEmail, subject, html || `<p>Order ${order.id} status: ${order.status}</p>`);
  }
}

export default EmailService;
