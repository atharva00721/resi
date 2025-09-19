/**
 * Utility functions for rate limiting and retry logic
 */

// Rate limiting configuration - Optimized for better performance
const RATE_LIMIT_CONFIG = {
  maxRetries: 4, // Reduced retries for faster failure
  baseDelay: 15000, // 2 seconds (optimized from 3s)
  maxDelay: 20000, // 20 seconds (reduced from 30s)
  timeout: 45000, // 45 seconds (reduced from 60s)
  delayBetweenCalls: 10000, // 3 seconds between different API calls (optimized from 5s)
  connectionTimeout: 8000, // 8 seconds for initial connection
  readTimeout: 40000, // 40 seconds for reading response
  rateLimitDelay: 10000, // 8 seconds when rate limit is hit (reduced from 10s)
};

// Track last API call time
let lastApiCallTime = 0;

/**
 * Sleep function for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number): number {
  const delay = RATE_LIMIT_CONFIG.baseDelay * Math.pow(2, attempt);
  return Math.min(delay, RATE_LIMIT_CONFIG.maxDelay);
}

/**
 * Ensure minimum delay between API calls
 */
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;

  if (timeSinceLastCall < RATE_LIMIT_CONFIG.delayBetweenCalls) {
    const waitTime = RATE_LIMIT_CONFIG.delayBetweenCalls - timeSinceLastCall;
    console.log(
      `⏳ Rate limiting: waiting ${Math.round(
        waitTime / 1000
      )} seconds before next API call...`
    );
    await sleep(waitTime);
  }

  lastApiCallTime = Date.now();
}

/**
 * Enhanced timeout wrapper with connection and read timeouts
 */
async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  timeoutType: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${timeoutType} timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    operation()
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Retry wrapper with exponential backoff and enhanced timeout handling
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string = "API call"
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RATE_LIMIT_CONFIG.maxRetries; attempt++) {
    try {
      // Enforce rate limiting before each attempt
      await enforceRateLimit();

      // Add enhanced timeout handling
      const result = await withTimeout(
        operation,
        RATE_LIMIT_CONFIG.timeout,
        "Operation"
      );
      return result;
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit error
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("rate limit") ||
          error.message.includes("rate_limit_exceeded") ||
          error.message.includes("429") ||
          error.message.includes("too many requests") ||
          error.message.includes("quota exceeded") ||
          error.message.includes("Rate limit"));

      // Check if it's a timeout error
      const isTimeout =
        error instanceof Error && error.message.includes("timeout");

      // Check if it's a connection error
      const isConnectionError =
        error instanceof Error &&
        (error.message.includes("ECONNRESET") ||
          error.message.includes("ENOTFOUND") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("connection"));

      // Don't retry on timeout or connection errors after first attempt
      if ((isTimeout || isConnectionError) && attempt > 0) {
        throw error;
      }

      // If it's the last attempt, throw the error
      if (attempt === RATE_LIMIT_CONFIG.maxRetries) {
        throw error;
      }

      // Calculate delay - use special rate limit delay if it's a rate limit error
      let delay: number;
      if (isRateLimit) {
        delay = RATE_LIMIT_CONFIG.rateLimitDelay + attempt * 5000; // 10s, 15s, 20s, 25s, 30s
        console.log(
          `🚫 Rate limit hit! ${operationName} failed (attempt ${attempt + 1}/${
            RATE_LIMIT_CONFIG.maxRetries + 1
          }): ${error instanceof Error ? error.message : "Unknown error"}`
        );
        console.log(`⏳ Waiting ${delay / 1000} seconds before retry...`);
      } else {
        delay = calculateBackoffDelay(attempt);
        console.log(
          `⚠️  ${operationName} failed (attempt ${attempt + 1}/${
            RATE_LIMIT_CONFIG.maxRetries + 1
          }): ${error instanceof Error ? error.message : "Unknown error"}`
        );
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
      }

      await sleep(delay);
    }
  }

  throw (
    lastError ||
    new Error(
      `${operationName} failed after ${
        RATE_LIMIT_CONFIG.maxRetries + 1
      } attempts`
    )
  );
}

/**
 * Parse JSON from streamed text with better error handling
 */
export function parseJsonFromStream(text: string): any {
  try {
    // Clean up the text - remove code fences and extra whitespace
    let cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Try to find the largest JSON object
    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = cleaned.slice(startIdx, endIdx + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e) {
        // Fall through to regex approach
      }
    }

    // Fallback: try regex match
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("JSON parsing error:", error);
    console.error("Raw response:", text);
    throw new Error(
      `Failed to parse JSON response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Log API call information
 */
export function logApiCall(agentName: string, attempt: number = 1): void {
  console.log(
    `🤖 ${agentName} - API call #${attempt} at ${new Date().toLocaleTimeString()}`
  );
}

/**
 * Enhanced streamText wrapper with better timeout handling
 */
export async function streamTextWithTimeout(
  streamTextFn: () => Promise<any>,
  timeoutMs: number = RATE_LIMIT_CONFIG.timeout
): Promise<any> {
  return withTimeout(streamTextFn, timeoutMs, "StreamText");
}

/**
 * Get timeout configuration for different operations
 */
export function getTimeoutConfig() {
  return {
    vision: RATE_LIMIT_CONFIG.timeout, // 60 seconds for vision analysis
    text: RATE_LIMIT_CONFIG.timeout, // 60 seconds for text analysis
    aggregation: RATE_LIMIT_CONFIG.timeout, // 60 seconds for aggregation
    connection: RATE_LIMIT_CONFIG.connectionTimeout, // 10 seconds for connection
    read: RATE_LIMIT_CONFIG.readTimeout, // 50 seconds for reading
  };
}

/**
 * Add extra delay when we know we're hitting rate limits
 */
export async function addRateLimitDelay(): Promise<void> {
  const extraDelay = 30000; // 30 seconds extra delay
  console.log(
    `🚫 Adding extra ${extraDelay / 1000} second delay due to rate limits...`
  );
  await sleep(extraDelay);
}
