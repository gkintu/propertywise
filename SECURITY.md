# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it privately to maintain the security of users.

### How to Report

1. **Do NOT create a public issue** for security vulnerabilities
2. Email: [Your email address or create one specifically for security reports]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- Acknowledgment of your report within 48 hours
- Regular updates on our progress
- Credit for the discovery (if desired)

## Security Best Practices for Users

### Environment Variables
- Never commit `.env.local` or any files containing API keys
- Use strong, unique API keys for production deployments
- Regularly rotate API keys

### Deployment Security
- Enable rate limiting by configuring Upstash Redis
- Use HTTPS in production
- Keep dependencies updated
- Monitor for security updates

### API Keys and Secrets
- **Gemini API Key**: Keep your Google AI API key secure
- **Redis Credentials**: Protect your Upstash Redis credentials
- **Environment Variables**: Never expose sensitive environment variables

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Features

This project includes:
- Rate limiting with Redis
- Content Security Policy (CSP) headers
- File upload validation (size and type limits)
- Input validation with Zod schemas
- No permanent storage of user documents
- Client-side processing where possible
