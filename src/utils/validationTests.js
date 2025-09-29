// Test Examples for Updated Email and Phone Validation

import { validateEmail, validatePhone, formatPhoneNumber } from '@/utils/validation';

console.log('=== EMAIL VALIDATION TESTS ===');

// Valid emails
console.log('Valid email:', validateEmail('user@example.com')); // []
console.log('Valid email:', validateEmail('test.email@domain.co.uk')); // []

// Invalid emails - missing @
console.log('Missing @:', validateEmail('userexample.com')); // ["Email must contain an @ symbol"]

// Invalid emails - missing .
console.log('Missing dot:', validateEmail('user@example')); // ["Email domain must contain a . (dot) symbol"]

// Invalid emails - multiple @
console.log('Multiple @:', validateEmail('user@@example.com')); // ["Email must have exactly one @ symbol"]

// Invalid emails - empty parts
console.log('Empty local:', validateEmail('@example.com')); // ["Email must have characters before the @ symbol"]
console.log('Empty domain:', validateEmail('user@')); // ["Email must have a domain after the @ symbol"]

console.log('\n=== PHONE VALIDATION TESTS ===');

// Valid phones
console.log('Valid mobile:', validatePhone('+32 456 123 456')); // []
console.log('Valid mobile:', validatePhone('+32456123456')); // []
console.log('Valid landline:', validatePhone('+32 2 123 4567')); // []

// Invalid phones - missing +32
console.log('Missing +32:', validatePhone('456-123-456')); // ["Phone number must start with +32"]
console.log('Missing +32:', validatePhone('456 123 456')); // ["Phone number must start with +32"]

// Invalid phones - wrong length
console.log('Too short:', validatePhone('+3245612345')); // ["Phone number must have 8-9 digits after +32"]
console.log('Too long:', validatePhone('+324561234567')); // ["Phone number must have 8-9 digits after +32"]

console.log('\n=== PHONE FORMATTING TESTS ===');

// Auto-formatting examples
console.log('Format 456123456:', formatPhoneNumber('456123456')); // "+32 456 123 456"
console.log('Format +32456123456:', formatPhoneNumber('+32456123456')); // "+32 456 123 456"
console.log('Format 456:', formatPhoneNumber('456')); // "+32 456"
console.log('Format 4561234:', formatPhoneNumber('4561234')); // "+32 456 123 4"
console.log('Format 21234567:', formatPhoneNumber('21234567')); // "+32 21 234 567"
console.log('Format empty string:', formatPhoneNumber('')); // "+32 "
console.log('Format partial deletion:', formatPhoneNumber('+3')); // "+32 "
