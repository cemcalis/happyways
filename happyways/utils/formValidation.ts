// Form validation utilities

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  private rules: ValidationRules;

  constructor(rules: ValidationRules) {
    this.rules = rules;
  }

  validate(data: { [key: string]: string }): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(this.rules).forEach(field => {
      const fieldRules = this.rules[field];
      const value = data[field] || '';

      for (const rule of fieldRules) {
        // Required validation
        if (rule.required && !value.trim()) {
          errors[field] = rule.message;
          break;
        }

        // Skip other validations if field is empty and not required
        if (!value.trim() && !rule.required) {
          continue;
        }

        // Min length validation
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = rule.message;
          break;
        }

        // Max length validation
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = rule.message;
          break;
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message;
          break;
        }

        // Custom validation
        if (rule.custom && !rule.custom(value)) {
          errors[field] = rule.message;
          break;
        }
      }
    });

    return errors;
  }

  isValid(data: { [key: string]: string }): boolean {
    const errors = this.validate(data);
    return Object.keys(errors).length === 0;
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+90|0)?[5][0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  turkishPhone: /^(\+90|0)?[5][0-9]{9}$/,
  onlyNumbers: /^[0-9]+$/,
  onlyLetters: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  alphanumeric: /^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]+$/
};

// Pre-defined validation rules for common use cases
export const CommonValidationRules = {
  email: [
    { required: true, message: 'E-posta adresi gerekli' },
    { pattern: ValidationPatterns.email, message: 'Geçerli bir e-posta adresi girin' }
  ],
  password: [
    { required: true, message: 'Şifre gerekli' },
    { minLength: 8, message: 'Şifre en az 8 karakter olmalı' },
    { pattern: ValidationPatterns.password, message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermeli' }
  ],
  phone: [
    { required: true, message: 'Telefon numarası gerekli' },
    { pattern: ValidationPatterns.turkishPhone, message: 'Geçerli bir Türk telefon numarası girin (05xxxxxxxxx)' }
  ],
  name: [
    { required: true, message: 'Ad gerekli' },
    { minLength: 2, message: 'Ad en az 2 karakter olmalı' },
    { maxLength: 50, message: 'Ad en fazla 50 karakter olabilir' },
    { pattern: ValidationPatterns.onlyLetters, message: 'Ad sadece harflerden oluşmalı' }
  ],
  surname: [
    { required: true, message: 'Soyad gerekli' },
    { minLength: 2, message: 'Soyad en az 2 karakter olmalı' },
    { maxLength: 50, message: 'Soyad en fazla 50 karakter olabilir' },
    { pattern: ValidationPatterns.onlyLetters, message: 'Soyad sadece harflerden oluşmalı' }
  ],
  confirmPassword: (password: string) => [
    { required: true, message: 'Şifre onayı gerekli' },
    { custom: (value: string) => value === password, message: 'Şifreler eşleşmiyor' }
  ]
};

// Utility function to show validation errors
export const getFirstError = (errors: ValidationErrors): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

// Utility function to check if field has error
export const hasError = (errors: ValidationErrors, field: string): boolean => {
  return !!errors[field];
};

// Utility function to get error message for field
export const getError = (errors: ValidationErrors, field: string): string => {
  return errors[field] || '';
};
