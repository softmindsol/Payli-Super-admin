export const decodeJWTPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.warn("Failed to decode JWT token:", error.message);
    return null;
  }
};

export const isJWTExpired = (token) => {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    return true; // Treat invalid tokens as expired
  }

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

export const getJWTExpiry = (token) => {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
};

export const getTimeUntilJWTExpiry = (token) => {
  const expiryDate = getJWTExpiry(token);

  if (!expiryDate) {
    return 0;
  }

  return expiryDate.getTime() - Date.now();
};

export const isValidAuthToken = (token) => {
  if (!token) return false;

  const payload = decodeJWTPayload(token);
  if (!payload) return false;

  return !isJWTExpired(token);
};
