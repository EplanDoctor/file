import { NextResponse } from 'next/server';
import { shopier } from '@/lib/shopier';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log('Shopier Callback Received:', data);

    // 1. Verify Signature
    const isValid = shopier.verifyWebhook(data);
    if (!isValid) {
      console.error('Shopier Invalid Webhook Attempt:', data);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=invalid_token`);
    }

    // 2. Extract Data
    const { res_status, res_order_id } = data;

    if (res_status === 'success') {
      // res_order_id format: userId|productType|productId|timestamp
      // pay/route.ts: `${userId.substring(0, 15)}|${productType.substring(0, 5)}|${productId.substring(0, 20)}|${idTimestamp}`
      const parts = res_order_id.split('|');
      
      if (parts.length < 3) {
        console.error('Invalid order ID format from Shopier:', res_order_id);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=invalid_order_id`);
      }

      const userId = parts[0];
      const productType = parts[1];
      const productId = parts[2];

      console.log('Payment Success Processing:', { userId, productType, productId, full_order_id: res_order_id });

      if (userId && productType && productId) {
        // 3. Mark as purchased in Firestore
        // Note: Using the potentially truncated productId from pay route.
        // If your productId's are longer than 20, you must ensure they match.
        const purchaseRef = doc(db, `users/${userId}/purchases`, productId);
        await setDoc(purchaseRef, {
          productId,
          productType,
          purchaseDate: Timestamp.now(),
          orderId: res_order_id,
          status: 'completed'
        });

        console.log('Purchase recorded in Firestore for user:', userId);

        // 4. Redirect based on type
        let redirectPath = '/';
        const typePrefix = productType.toLowerCase();
        
        if (typePrefix.startsWith('video')) redirectPath = '/videos';
        else if (typePrefix.startsWith('doc')) redirectPath = '/docs';
        else if (typePrefix.startsWith('circu')) redirectPath = '/docs';
        else if (typePrefix.startsWith('autoc')) redirectPath = '/docs';
        else if (typePrefix.startsWith('exper')) redirectPath = '/instant-solve';

        const finalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${redirectPath}?status=success&item=${productId}`;
        console.log('Redirecting user to:', finalUrl);
        return NextResponse.redirect(finalUrl);
      }
    }

    console.warn('Payment failed or incomplete data:', data);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?status=${res_status}`);

  } catch (error) {
    console.error('Shopier callback exception:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?reason=server_error`);
  }
}
