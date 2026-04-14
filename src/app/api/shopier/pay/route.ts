import { NextResponse } from 'next/server';
import { shopier, ShopierOrderData } from '@/lib/shopier';
import { PRICES } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productType, productId, productName, buyer, userId } = body;

    if (!productType || !productId || !buyer || !userId) {
      return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
    }

    // Determine price
    let price = 0;
    switch (productType) {
      case 'video': price = PRICES.VIDEO; break;
      case 'doc': price = PRICES.DOC; break;
      case 'circuit': price = PRICES.CIRCUIT; break;
      case 'autocad': price = PRICES.AUTOCAD; break;
      case 'expert': price = PRICES.EXPERT; break;
      default: return NextResponse.json({ error: 'Geçersiz ürün tipi.' }, { status: 400 });
    }

    // Final format: userId|productType|productId|timestamp
    // Shopier has a 64 character limit for order_id.
    // We use "|" to match the split logic in callback/route.ts
    const idTimestamp = Date.now().toString(36);
    const orderId = `${userId.substring(0, 15)}|${productType.substring(0, 10)}|${productId.substring(0, 20)}|${idTimestamp}`;
    
    console.log('Shopier Order Generated:', { orderId, length: orderId.length });

    const orderData: ShopierOrderData = {
      order_id: orderId,
      total_price: price,
      product_name: productName || `EplanDoctor - ${productType}`,
      buyer: {
        id: userId,
        name: buyer.name || 'Müşteri',
        surname: buyer.surname || 'Soyadı',
        email: buyer.email || 'email@example.com',
        phone: buyer.phone || '05555555555',
        address: buyer.address || 'Türkiye',
        city: buyer.city || 'İstanbul',
        country: 'Türkiye',
        postcode: buyer.postcode || '34000',
      }
    };

    const paymentForm = shopier.generatePaymentForm(orderData);

    return NextResponse.json(paymentForm);

  } catch (error) {
    console.error('Shopier payment initiation error:', error);
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
