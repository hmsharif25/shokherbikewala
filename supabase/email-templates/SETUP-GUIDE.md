# Supabase Email Templates Setup Guide

## How to Customize Email Templates in Supabase Dashboard

Follow these steps to apply the branded "Shokher Bikewala" email templates:

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/pfegrhsefyqqjzmbgurs

### Step 2: Navigate to Email Templates
1. Click **Authentication** in the left sidebar
2. Click **Email Templates** tab

### Step 3: Update Each Template

You'll see 5 template types. For each one:
1. Click on the template name to expand it
2. **Change the Subject** line (see below)
3. Replace the **Body** HTML with the content from the corresponding file in this folder
4. Click **Save**

#### Template Subjects & Files:

| Template Type        | Subject Line                                          | File                    |
|---------------------|------------------------------------------------------|-------------------------|
| Confirm signup      | `Shokher Bikewala - Confirm Your Email`              | `confirm-signup.html`   |
| Reset password      | `Shokher Bikewala - Reset Your Password`             | `reset-password.html`   |
| Magic link          | `Shokher Bikewala - Your Login Link`                 | `magic-link.html`       |
| Invite user         | `Shokher Bikewala - You're Invited!`                 | `invite-user.html`      |
| Change email        | `Shokher Bikewala - Confirm Email Change`            | `change-email.html`     |

### Step 4: Update Sender Name
1. Go to **Settings** > **Authentication** in the Supabase Dashboard
2. Under **SMTP Settings**, you can set a custom sender name
3. Set **Sender name** to: `Shokher Bikewala`
4. If you have a custom domain, you can also set a custom **Sender email** like: `noreply@shokherbikewala.com`

### Step 5: (Optional) Custom SMTP
For better deliverability and full branding control:
1. Go to **Settings** > **Authentication** > **SMTP Settings**
2. Enable **Custom SMTP**
3. You can use services like:
   - **Resend** (resend.com) - Free tier: 100 emails/day
   - **Brevo** (brevo.com) - Free tier: 300 emails/day
   - **Mailgun** - Pay as you go
4. This lets you send from your own domain (e.g., `noreply@shokherbikewala.com`)

## Template Variables
These templates use Supabase's built-in template variables:
- `{{ .ConfirmationURL }}` - The confirmation/action link
- `{{ .CurrentYear }}` - Current year for copyright

## Notes
- All templates use inline CSS for maximum email client compatibility
- Dark theme matches the website's gaming aesthetic
- Brand colors: Orange (#FF6A1A), Cyan (#00D4FF)
- Social links are included in the footer of every email
