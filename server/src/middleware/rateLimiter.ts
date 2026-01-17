import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints
 * Prevents brute-force attacks on login
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests from counting
    skipSuccessfulRequests: true,
});

/**
 * Rate limiter for report submission
 * Prevents spam/abuse of the submission endpoint
 */
export const submitRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour
    message: { error: 'Too many submissions, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { error: 'Too many requests, please slow down' },
    standardHeaders: true,
    legacyHeaders: false,
});
