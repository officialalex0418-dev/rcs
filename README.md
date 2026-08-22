# Royal Consultancy Services

Welcome to the Royal Consultancy Services project! This repository contains the official website for Royal Consultancy Services.

## Project Structure

- `my-website/` - Contains the React-based website code

## Getting Started

1. Navigate to the `my-website` directory:
   ```bash
   cd my-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up email integration (see below)

4. Start the development server:
   ```bash
   npm run dev
   ```

## Email Integration

The contact form is integrated with EmailJS to send inquiries directly to your email. To set this up:

1. Sign up for an account at [EmailJS](https://www.emailjs.com/)
2. Connect your email service provider (Gmail, Outlook, etc.)
3. Create a new email template with the following variables:
   - `from_name` - Sender's name
   - `from_email` - Sender's email
   - `subject` - Email subject
   - `message` - Message content
   - `to_email` - Recipient email
4. Update the `.env` file in the `my-website` directory with your EmailJS credentials:
   - `VITE_EMAILJS_SERVICE_ID` - Your EmailJS service ID
   - `VITE_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID
   - `VITE_EMAILJS_PUBLIC_KEY` - Your EmailJS public key

## Technologies Used

- React
- Vite
- Tailwind CSS
- Framer Motion
- EmailJS