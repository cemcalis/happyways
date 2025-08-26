import i18n from '../i18n';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string, data?: Record<string, string>) => boolean | string;
  messageKey?: string;
  message?: string;
}

export type ValidationRules = Record<string, ValidationRule[]>;

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  private rules: ValidationRules;

  constructor(rules: ValidationRules) {
    this.rules = rules;
  }

  validate(data: Record<string, string>): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const field of Object.keys(this.rules)) {
      const fieldRules = this.rules[field];
      const raw = data[field];
      const value = typeof raw === 'string' ? raw : '';

      for (const rule of fieldRules) {
    
        if (rule.required && !value.trim()) {
          errors[field] = this.resolveMessage(rule, 'required', { field, value, data });
          break;
        }
        if (!value.trim() && !rule.required) {
          continue;
        }
        if (typeof rule.minLength === 'number' && value.length < rule.minLength) {
          errors[field] = this.resolveMessage(rule, 'minLength', { field, value, data });
          break;
        }
        if (typeof rule.maxLength === 'number' && value.length > rule.maxLength) {
          errors[field] = this.resolveMessage(rule, 'maxLength', { field, value, data });
          break;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = this.resolveMessage(rule, 'pattern', { field, value, data });
          break;
        }

        if (rule.custom) {
          const res = rule.custom(value, data);
          if (res !== true) {
            errors[field] =
              typeof res === 'string'
                ? res
                : this.resolveMessage(rule, 'custom', { field, value, data });
            break;
          }
        }
      }
    }

    return errors;
  }

  isValid(data: Record<string, string>): boolean {
    const errors = this.validate(data);
    return Object.keys(errors).length === 0;
  }

  private resolveMessage(
    rule: ValidationRule,
    kind: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom',
    ctx: { field: string; value: string; data: Record<string, string> }
  ): string {
    if (rule.message) return rule.message;
    if (rule.messageKey) return i18n.t(rule.messageKey);

    switch (kind) {
      case 'required':
        return i18n.t('validation.defaultRequired', { defaultValue: 'This field is required' });
      case 'minLength':
        return i18n.t('validation.defaultMinLength', {
          defaultValue: 'Minimum length is {{min}} characters',
          min: rule.minLength ?? 0,
        });
      case 'maxLength':
        return i18n.t('validation.defaultMaxLength', {
          defaultValue: 'Maximum length is {{max}} characters',
          max: rule.maxLength ?? 0,
        });
      case 'pattern':
        return i18n.t('validation.defaultPattern', { defaultValue: 'Invalid format' });
      case 'custom':
      default:
        return i18n.t('validation.defaultInvalid', { defaultValue: 'Invalid value' });
    }
  }
}

export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+90|0)?[5][0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  turkishPhone: /^(\+90|0)?[5][0-9]{9}$/,
  onlyNumbers: /^[0-9]+$/,
  onlyLetters: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
  alphanumeric: /^[a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]+$/,
};

export const CommonValidationRules: ValidationRules = {
  email: [
    { required: true, messageKey: 'validation.emailRequired' },
    { pattern: ValidationPatterns.email, messageKey: 'validation.emailInvalid' },
  ],
  password: [
    { required: true, messageKey: 'validation.passwordRequired' },
    { minLength: 8, messageKey: 'validation.passwordMin' },
    { pattern: ValidationPatterns.password, messageKey: 'validation.passwordPattern' },
  ],
  phone: [
    { required: true, messageKey: 'validation.phoneRequired' },
    { pattern: ValidationPatterns.turkishPhone, messageKey: 'validation.phoneInvalid' },
  ],
  name: [
    { required: true, messageKey: 'validation.nameRequired' },
    { minLength: 2, messageKey: 'validation.nameMin' },
    { maxLength: 50, messageKey: 'validation.nameMax' },
    { pattern: ValidationPatterns.onlyLetters, messageKey: 'validation.namePattern' },
  ],
  surname: [
    { required: true, messageKey: 'validation.surnameRequired' },
    { minLength: 2, messageKey: 'validation.surnameMin' },
    { maxLength: 50, messageKey: 'validation.surnameMax' },
    { pattern: ValidationPatterns.onlyLetters, messageKey: 'validation.surnamePattern' },
  ],
};

export const confirmPasswordRules = (password: string): ValidationRule[] => [
  { required: true, messageKey: 'validation.confirmPasswordRequired' },
  {
    custom: (value: string) => value === password || i18n.t('validation.passwordsNotMatch'),
    messageKey: 'validation.passwordsNotMatch', 
  },
];

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
