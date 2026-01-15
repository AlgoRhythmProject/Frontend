// Validation utilities for user input

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateName(name: string, fieldName: string = "Name"): ValidationResult {
    // Trim whitespace
    const trimmed = name.trim();

    // Check if empty
    if (!trimmed) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }

    // Check length
    if (trimmed.length < 1) {
        return {
            isValid: false,
            error: `${fieldName} must be at least 1 character long`
        };
    }

    if (trimmed.length > 20) {
        return {
            isValid: false,
            error: `${fieldName} must be no more than 20 characters long`
        };
    }

    // Check for HTML tags or script content
    const htmlPattern = /<[^>]*>|javascript:|<script|on\w+=/i;
    if (htmlPattern.test(trimmed)) {
        return {
            isValid: false,
            error: `${fieldName} contains invalid characters`
        };
    }

    // Allow only letters (including unicode), spaces, hyphens, and apostrophes
    // This pattern supports international names like José, François, etc.
    const namePattern = /^[\p{L}\s'-]+$/u;
    if (!namePattern.test(trimmed)) {
        return {
            isValid: false,
            error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
        };
    }

    // Check for excessive special characters (more than 2 consecutive)
    if (/[-']{3,}/.test(trimmed)) {
        return {
            isValid: false,
            error: `${fieldName} contains too many consecutive special characters`
        };
    }

    return { isValid: true };
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
    const trimmed = email.trim();

    if (!trimmed) {
        return {
            isValid: false,
            error: "Email is required"
        };
    }

    // Basic email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
        return {
            isValid: false,
            error: "Please enter a valid email address"
        };
    }

    // Check length
    if (trimmed.length > 254) {
        return {
            isValid: false,
            error: "Email address is too long"
        };
    }

    return { isValid: true };
}

/**
 * Validates a password
 */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return {
            isValid: false,
            error: "Password is required"
        };
    }

    if (password.length < 8) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long"
        };
    }

    if (password.length > 128) {
        return {
            isValid: false,
            error: "Password is too long (max 128 characters)"
        };
    }

    return { isValid: true };
}


export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}