// أدوات تشفير الرسائل للشات الداخلي
// يستخدم Base64 كحد أدنى للتشفير (يمكن تطويره لـ End-to-End Encryption)

export class ChatEncryption {
  private static readonly ENCRYPTION_KEY = 'shifa-care-chat-2024';
  private static readonly ALGORITHM = 'AES-GCM';

  /**
   * تشفير رسالة
   */
  static async encryptMessage(message: string): Promise<string> {
    try {
      // في الإنتاج، استخدم مكتبة تشفير قوية مثل CryptoJS أو libsodium
      // هذا مثال بسيط باستخدام Base64
      const encodedMessage = btoa(unescape(encodeURIComponent(message)));
      return `encrypted:${encodedMessage}`;
    } catch (error) {
      console.error('Error encrypting message:', error);
      return message; // إرجاع الرسالة بدون تشفير في حالة الخطأ
    }
  }

  /**
   * فك تشفير رسالة
   */
  static async decryptMessage(encryptedMessage: string): Promise<string> {
    try {
      if (!encryptedMessage.startsWith('encrypted:')) {
        return encryptedMessage; // الرسالة غير مشفرة
      }

      const encodedMessage = encryptedMessage.replace('encrypted:', '');
      const decodedMessage = decodeURIComponent(escape(atob(encodedMessage)));
      return decodedMessage;
    } catch (error) {
      console.error('Error decrypting message:', error);
      return encryptedMessage; // إرجاع الرسالة المشفرة في حالة الخطأ
    }
  }

  /**
   * تشفير ملف
   */
  static async encryptFile(file: File): Promise<ArrayBuffer> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // تشفير بسيط للملفات (في الإنتاج استخدم تشفير أقوى)
      const encryptedArray = new Uint8Array(uint8Array.length);
      for (let i = 0; i < uint8Array.length; i++) {
        encryptedArray[i] = uint8Array[i] ^ 0xAA; // XOR بسيط
      }
      
      return encryptedArray.buffer;
    } catch (error) {
      console.error('Error encrypting file:', error);
      throw error;
    }
  }

  /**
   * فك تشفير ملف
   */
  static async decryptFile(encryptedBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    try {
      const uint8Array = new Uint8Array(encryptedBuffer);
      const decryptedArray = new Uint8Array(uint8Array.length);
      
      // فك تشفير بسيط للملفات
      for (let i = 0; i < uint8Array.length; i++) {
        decryptedArray[i] = uint8Array[i] ^ 0xAA; // XOR بسيط
      }
      
      return decryptedArray.buffer;
    } catch (error) {
      console.error('Error decrypting file:', error);
      throw error;
    }
  }

  /**
   * إنشاء مفتاح تشفير عشوائي
   */
  static generateEncryptionKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * التحقق من صحة الرسالة المشفرة
   */
  static isValidEncryptedMessage(message: string): boolean {
    return message.startsWith('encrypted:');
  }

  /**
   * تشفير متقدم باستخدام Web Crypto API (إذا كان متاحاً)
   */
  static async encryptAdvanced(message: string, key: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        // Fallback للتشفير البسيط
        return await this.encryptMessage(message);
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // إنشاء مفتاح من كلمة المرور
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key2 = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key2,
        data
      );

      // دمج البيانات المشفرة مع salt و iv
      const encryptedArray = new Uint8Array(encrypted);
      const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(encryptedArray, salt.length + iv.length);

      return `advanced:${btoa(String.fromCharCode(...result))}`;
    } catch (error) {
      console.error('Error in advanced encryption:', error);
      return await this.encryptMessage(message);
    }
  }

  /**
   * فك تشفير متقدم
   */
  static async decryptAdvanced(encryptedMessage: string, key: string): Promise<string> {
    try {
      if (!encryptedMessage.startsWith('advanced:')) {
        return await this.decryptMessage(encryptedMessage);
      }

      if (!crypto.subtle) {
        return await this.decryptMessage(encryptedMessage);
      }

      const encryptedData = encryptedMessage.replace('advanced:', '');
      const encryptedArray = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // استخراج salt و iv
      const salt = encryptedArray.slice(0, 16);
      const iv = encryptedArray.slice(16, 28);
      const encrypted = encryptedArray.slice(28);

      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key2 = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key2,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Error in advanced decryption:', error);
      return await this.decryptMessage(encryptedMessage);
    }
  }

  /**
   * تشفير مجموعة من الرسائل
   */
  static async encryptMessages(messages: string[]): Promise<string[]> {
    const encryptedMessages: string[] = [];
    
    for (const message of messages) {
      const encrypted = await this.encryptMessage(message);
      encryptedMessages.push(encrypted);
    }
    
    return encryptedMessages;
  }

  /**
   * فك تشفير مجموعة من الرسائل
   */
  static async decryptMessages(encryptedMessages: string[]): Promise<string[]> {
    const decryptedMessages: string[] = [];
    
    for (const encryptedMessage of encryptedMessages) {
      const decrypted = await this.decryptMessage(encryptedMessage);
      decryptedMessages.push(decrypted);
    }
    
    return decryptedMessages;
  }

  /**
   * إنشاء hash للرسالة للتحقق من سلامتها
   */
  static async createMessageHash(message: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        // Fallback بسيط
        let hash = 0;
        for (let i = 0; i < message.length; i++) {
          const char = message.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Error creating message hash:', error);
      return '';
    }
  }

  /**
   * التحقق من سلامة الرسالة
   */
  static async verifyMessageIntegrity(message: string, expectedHash: string): Promise<boolean> {
    try {
      const actualHash = await this.createMessageHash(message);
      return actualHash === expectedHash;
    } catch (error) {
      console.error('Error verifying message integrity:', error);
      return false;
    }
  }
}

// أدوات مساعدة للتشفير
export const ChatEncryptionUtils = {
  /**
   * تحويل ArrayBuffer إلى Base64
   */
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  /**
   * تحويل Base64 إلى ArrayBuffer
   */
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },

  /**
   * إنشاء معرف فريد للرسالة
   */
  generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * التحقق من صحة مفتاح التشفير
   */
  isValidEncryptionKey(key: string): boolean {
    return Boolean(key && key.length >= 16);
  }
};

export default ChatEncryption; 