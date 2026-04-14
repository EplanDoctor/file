import crypto from 'crypto';

export interface ShopierBuyerData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
}

export interface ShopierOrderData {
  order_id: string;
  total_price: number;
  product_name: string;
  buyer: ShopierBuyerData;
}

/**
 * Shopier Payment Service
 * Handles signature generation and redirection form preparation.
 */
export class ShopierService {
  private clientID: string;
  private clientSecret: string;
  private webhookToken: string;

  constructor() {
    this.clientID = process.env.SHOPIER_CLIENT_ID || '';
    this.clientSecret = process.env.SHOPIER_CLIENT_SECRET || '';
    this.webhookToken = process.env.SHOPIER_WEBHOOK_TOKEN || '';

    // Debug: Check if keys are missing
    if (!this.clientID || !this.clientSecret || !this.webhookToken) {
      console.error('CRITICAL: Shopier API keys are missing in .env.local');
    }
  }

  /**
   * Generates a Shopier Payment Form (HTML POST)
   */
  generatePaymentForm(order: ShopierOrderData) {
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/shopier/callback`;
    
    // Ensure price has 2 decimals as Shopier sometimes requires precise string matching
    const formattedPrice = Number(order.total_price).toFixed(2);
    
    const data = {
      APIKey: this.clientID,
      buyer_id: order.buyer.id,
      buyer_name: order.buyer.name,
      buyer_surname: order.buyer.surname,
      buyer_email: order.buyer.email,
      buyer_phone: order.buyer.phone,
      buyer_address: order.buyer.address,
      buyer_city: order.buyer.city,
      buyer_country: order.buyer.country,
      buyer_postcode: order.buyer.postcode,
      total_order_value: formattedPrice,
      currency: 'TL',
      platform: '0',
      is_test: '0', 
      random_nr: Math.floor(Math.random() * 1000000).toString(),
      order_id: order.order_id,
      product_name: order.product_name,
      callback_url: callbackUrl,
    };

    // Correct Shopier signature formula:
    // signature = hmac_sha256(random_nr + order_id + total_order_value, client_secret)
    const signatureBase = data.random_nr + data.order_id + data.total_order_value;
    const signature = crypto
      .createHmac('sha256', this.clientSecret)
      .update(signatureBase)
      .digest('base64');

    console.log('Shopier Payment Initiated:', { order_id: data.order_id, price: formattedPrice });

    return {
      action: 'https://www.shopier.com/ShowProduct/api/pay4.php',
      fields: {
        ...data,
        signature
      }
    };
  }

  /**
   * Verifies incoming webhook/callback signature
   */
  verifyWebhook(postData: any): boolean {
    const { res_token, res_status, res_order_id } = postData;
    if (!res_token || !res_status || !res_order_id) {
      console.warn('Shopier Webhook Missing Fields:', postData);
      return false;
    }

    // Signature verification logic for Shopier callback:
    // Verification = hmac_sha256(res_order_id + res_status, webhook_token)
    const expectedToken = crypto
      .createHmac('sha256', this.webhookToken)
      .update(res_order_id + res_status)
      .digest('base64');

    const isValid = res_token === expectedToken;
    if (!isValid) {
      console.error('CRITICAL: Shopier Webhook Signature Mismatch!', {
        received: res_token,
        expected: expectedToken,
        formula: `${res_order_id} + ${res_status}`,
        order_id: res_order_id,
        webhook_token_exists: !!this.webhookToken
      });
    } else {
      console.log('Shopier Webhook Verified Successfully for order:', res_order_id);
    }

    return isValid;
  }
}

export const shopier = new ShopierService();
