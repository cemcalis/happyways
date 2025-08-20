import i18n from '../i18n';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  messageKey: string;
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
   
        if (rule.required && !value.trim()) {
          errors[field] = i18n.t(rule.messageKey);
          break;
        }

        if (!value.trim() && !rule.required) {
          continue;
        }

        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = i18n.t(rule.messageKey);
          break;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = i18n.t(rule.messageKey);
          break;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = i18n.t(rule.messageKey);
          break;
        }
        if (rule.custom && !rule.custom(value)) {
          errors[field] = i18n.t(rule.messageKey);
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

export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+90|0)?[5][0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  turkishPhone: /^(\+90|0)?[5][0-9]{9}$/,
  onlyNumbers: /^[0-9]+$/,
  onlyLetters: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  alphanumeric: /^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]+$/
};

export const CommonValidationRules = {
  email: [
    { required: true, messageKey: 'validation.emailRequired' },
    { pattern: ValidationPatterns.email, messageKey: 'validation.emailInvalid' }
  ],
  password: [
    { required: true, messageKey: 'validation.passwordRequired' },
    { minLength: 8, messageKey: 'validation.passwordMin' },
    { pattern: ValidationPatterns.password, messageKey: 'validation.passwordPattern' }
  ],
  phone: [
    { required: true, messageKey: 'validation.phoneRequired' },
    { pattern: ValidationPatterns.turkishPhone, messageKey: 'validation.phoneInvalid' }
  ],
  name: [
    { required: true, messageKey: 'validation.nameRequired' },
    { minLength: 2, messageKey: 'validation.nameMin' },
    { maxLength: 50, messageKey: 'validation.nameMax' },
    { pattern: ValidationPatterns.onlyLetters, messageKey: 'validation.namePattern' }
  ],
  surname: [
    { required: true, messageKey: 'validation.surnameRequired' },
    { minLength: 2, messageKey: 'validation.surnameMin' },
    { maxLength: 50, messageKey: 'validation.surnameMax' },
    { pattern: ValidationPatterns.onlyLetters, messageKey: 'validation.surnamePattern' }
  ],
  confirmPassword: (password: string) => [
    { required: true, messageKey: 'validation.confirmPasswordRequired' },
    { custom: (value: string) => value === password, messageKey: 'validation.passwordsNotMatch' }
  ]
};

export const getFirstError = (errors: ValidationErrors): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

export const hasError = (errors: ValidationErrors, field: string): boolean => {
  return !!errors[field];
};

export const getError = (errors: ValidationErrors, field: string): string => {
  return errors[field] || '';
};
