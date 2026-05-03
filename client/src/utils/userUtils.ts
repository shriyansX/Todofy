// User utilities for managing unique user sessions
export class UserUtils {
  private static readonly USER_ID_KEY = 'todofy_user_id';

  // Generate a unique user ID based on browser characteristics
  static generateUserId(): string {
    // Create a semi-unique ID based on browser characteristics
    const navigator = window.navigator;
    const screen = window.screen;
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled ? '1' : '0'
    ].join('|');
    
    // Simple hash function to convert fingerprint to shorter ID
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive number and add timestamp for uniqueness
    const uniqueId = Math.abs(hash).toString(36) + Date.now().toString(36);
    return uniqueId;
  }

  // Get or create user ID
  static getUserId(): string {
    try {
      let userId = localStorage.getItem(this.USER_ID_KEY);
      
      if (!userId) {
        userId = this.generateUserId();
        localStorage.setItem(this.USER_ID_KEY, userId);
      }
      
      return userId;
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn('localStorage not available, using session-based ID');
      return this.generateUserId();
    }
  }

  // Reset user ID (for testing or if user wants a fresh start)
  static resetUserId(): string {
    try {
      localStorage.removeItem(this.USER_ID_KEY);
    } catch (error) {
      console.warn('Could not clear localStorage');
    }
    
    return this.getUserId();
  }

  // Get user display name or generate one
  static getUserDisplayId(): string {
    const userId = this.getUserId();
    return `User-${userId.slice(-6).toUpperCase()}`;
  }
}