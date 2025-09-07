# EmailJS Setup Guide for Castify Contact Form

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. Follow the setup instructions to connect your Gmail account
5. Note down the **Service ID** (you'll need this)

## Step 3: Create Email Template

1. Go to "Email Templates" in dashboard
2. Click "Create New Template"
3. Use this template content:

**Template ID**: `template_contact_form` (you can customize)

**Subject**: `New Contact Form Message from {{from_name}}`

**Content**:

```
Hello,

You have received a new message from your Castify website contact form:

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the Castify contact form.
```

4. Save the template and note the **Template ID**

## Step 4: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (starts with something like "user\_...")
3. Copy this key

## Step 5: Update MainPage.jsx

Replace these values in the `handleContactSubmit` function in MainPage.jsx:

```javascript
const serviceId = "your_service_id_here"; // From Step 2
const templateId = "template_contact_form"; // From Step 3
const publicKey = "your_public_key_here"; // From Step 4
```

## Step 6: Test the Form

1. Fill out the contact form on your website
2. Submit the form
3. Check your Gmail inbox for the message
4. Also check your EmailJS dashboard for sending logs

## Example Configuration:

```javascript
const serviceId = "service_abc123";
const templateId = "template_contact_form";
const publicKey = "user_xyz789";
```

## Free Tier Limits:

- 200 emails per month
- No credit card required
- Perfect for contact forms

## Security Note:

Your public key is safe to use in frontend code. It only allows sending emails, not reading them.

## Troubleshooting:

1. Make sure all IDs are correct
2. Check EmailJS dashboard for error logs
3. Verify your email service is properly connected
4. Ensure template variables match the code

That's it! Your contact form will now send emails directly to kinshuk380@gmail.com
