import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "your_access_token_secret_here";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret_here";

// Explicitly cast these to any or jwt.SignOptions['expiresIn'] to satisfy the type checker
const ACCESS_TOKEN_EXPIRATION = (process.env.JWT_ACCESS_EXPIRATION || "15m") as SignOptions['expiresIn'];
const REFRESH_TOKEN_EXPIRATION = (process.env.JWT_REFRESH_EXPIRATION || "7d") as SignOptions['expiresIn'];

interface signInData {
    userId: number;
}

export const signAccessToken = (payload: signInData) => {
    // We pass the options as a typed object
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION
    });
};

export const signRefreshToken = (payload: signInData) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRATION
    });
};