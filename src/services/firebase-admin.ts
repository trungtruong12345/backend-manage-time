import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { LOGO_URL } from 'src/config/relaited-frontend';
import configFirebase from '../config/firebase';

export function init() {
  const serviceAccount = JSON.stringify(configFirebase);
  admin.initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
  });
}

// I use Typescript, you may not, but types will help you
// to understand what data structures FCM expects.
// It's an internal structure though, firebase-admin has
// good typings in the library
interface Message {
  title: string;
  body: string;
  requireInteraction?: boolean;
  link?: string;
}

// Use this function to send push notifications to a specific user
export async function sendFCMMessage(
  fcmToken: string,
  msg: Message,
): Promise<string> {
  try {
    const res = await getMessaging().send({
      webpush: {
        notification: {
          ...msg,
          icon: LOGO_URL,
          requireInteraction: msg.requireInteraction ?? false,
          // actions: [
          //   {
          //     title: 'Open',
          //     action: 'open',
          //   },
          // ],
          data: {
            link: msg.link,
          },
        },
      },
      token: fcmToken,
    });
    return res;
  } catch (e) {
    console.error('sendFCMMessage error', e);
  }
}
