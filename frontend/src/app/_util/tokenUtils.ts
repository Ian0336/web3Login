/**
 * Interface representing a decoded JWT token payload
 */
export interface JwtPayload {
  // Standard JWT claims
  iss?: string;  // Issuer
  sub?: string;  // Subject
  aud?: string | string[];  // Audience
  exp?: number;  // Expiration Time
  nbf?: number;  // Not Before
  iat?: number;  // Issued At
  jti?: string;  // JWT ID
  
  // Custom claims
  address: string;  // Wallet address
  [key: string]: string | string[] | number | boolean | undefined;  // Allow for other custom claims
}

/**
 * Decode a JWT token to access its payload
 * @param token The JWT token to decode
 * @returns The decoded payload or null if the token is invalid
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    // Split the token into its parts
    const tokenParts = token.split('.');
    
    // Check if the token has the correct format (header.payload.signature)
    if (tokenParts.length !== 3) {
      return null;
    }
    
    // Base64 decode and parse the payload (second part)
    const base64Payload = tokenParts[1];
    const payload = JSON.parse(atob(base64Payload));
    
    return payload as JwtPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Verify if a token belongs to a specific address
 * @param token The JWT token to verify
 * @param address The wallet address to check against
 * @returns True if the token belongs to the address, false otherwise
 */
export const verifyTokenAddress = (token: string, address: string): boolean => {
  if (!token || !address) {
    return false;
  }

  const payload = decodeToken(token);
  console.log("payload", payload);
  if (!payload || !payload.address) {
    return false;
  }
  
  // Compare addresses in a case-insensitive way
  return payload.address.toLowerCase() === address.toLowerCase();
};

/**
 * Check if a token is expired
 * @param token The JWT token to check
 * @returns True if the token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  
  if (!payload || !payload.exp) {
    // If we can't determine expiration, consider it expired
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  return payload.exp < currentTime;
};

/**
 * Clear all authentication tokens from cookies
 */
export const clearAuthTokens = (): void => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

/**
 * Get a cookie by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or undefined if not found
 */
export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}; 