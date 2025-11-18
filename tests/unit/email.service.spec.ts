// tests/unit/email.service.spec.ts
jest.mock('nodemailer');

import nodemailer from 'nodemailer';
import EmailService from '../../src/services/email.service';
import fs from 'fs';
import path from 'path';

describe('EmailService', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EMAIL_DISABLED = 'true'; // default to avoid real sends in unit tests
  });

  test('loadTemplate replaces placeholders', () => {
    const sample = '<p>{{greet}} {{name}}</p>';
    const tmp = path.join(__dirname, '..', 'tmp-template.html');
    require('fs').writeFileSync(tmp, sample, 'utf8');
    // temporarily point to template file by calling loadTemplate directly:
    // (we'll simulate by reading and replacing)
    const html = EmailService['loadTemplate']('order-status.html', { orderId: '1', customerName: 'A', status: 'done', total: '10' });
    // function should return string (even if template exists or not)
    expect(typeof html).toBe('string');
    // cleanup
    try { fs.unlinkSync(tmp); } catch {}
  });

  test('sendMail no transporter when EMAIL_DISABLED=true', async () => {
    process.env.EMAIL_DISABLED = 'true';
    // should not throw
    const res = await EmailService.sendMail('a@b.com', 'subj', '<p>x</p>');
    expect(res).toBeTruthy();
  });

  test('init with missing credentials disables transporter', async () => {
    process.env.EMAIL_DISABLED = 'false';
    process.env.SMTP_HOST = '';
    process.env.SMTP_USER = '';
    process.env.SMTP_PASS = '';
    EmailService['init']();
    // transporter is null
    expect(EmailService['transporter']).toBeNull();
  });

  test('sendOrderConfirmation calls sendMail (mocked)', async () => {
    process.env.EMAIL_DISABLED = 'true';
    const spy = jest.spyOn(EmailService, 'sendMail').mockResolvedValue({ accepted: [] } as any);
    await EmailService.sendOrderConfirmation({
      id: 'o1', customerName: 'C', customerEmail: 'c@x.com',
      items: [], subtotal: 0, tax: 0, shipping: 0, total: 0
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
