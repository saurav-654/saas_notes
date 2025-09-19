# SaaS Notes App

A modern, responsive notes application built with Next.js 14, featuring a beautiful custom color palette and comprehensive authentication system.

## Features

- **Beautiful Custom Color Palette**: Space Cadet, Ultra Violet, Rose Quartz, Pale Dogwood, and Isabelline
- **Multiple Authentication Methods**: Email/password, Google OAuth, and phone OTP
- **Dark/Light Mode**: Full theme switching with custom color adaptations
- **Mobile Responsive**: Optimized for all screen sizes with touch-friendly interactions
- **Modern UI Components**: Built with shadcn/ui and Radix UI primitives
- **Notes Management**: Create, edit, delete, and organize your notes
- **Lucide Icons**: Clean, consistent iconography throughout

## Color Palette

- **Space Cadet**: `#22223b` - Primary brand color
- **Ultra Violet**: `#4a4e69` - Secondary actions and text
- **Rose Quartz**: `#9a8c98` - Accent and interactive elements
- **Pale Dogwood**: `#c9ada7` - Borders and subtle backgrounds
- **Isabelline**: `#f2e9e4` - Light backgrounds and text

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Typography**: Geist Sans & Geist Mono fonts
- **Animations**: Tailwind CSS animations + custom keyframes

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser** and navigate to `http://localhost:3000`

## Authentication

The app includes three authentication methods:

### Email Login
- Demo credentials: `demo@example.com` / `password`
- Full form validation and error handling

### Google OAuth
- Simulated Google authentication flow
- One-click sign-in experience

### Phone OTP
- SMS verification simulation
- Demo OTP: `123456`

## Project Structure

\`\`\`
saas-notes-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and custom properties
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx          # Authentication page
│   └── dashboard/        # Dashboard pages
├── components/
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard and notes components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── lib/
    └── utils.ts          # Utility functions
\`\`\`

## Mobile Features

- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Touch Optimization**: 44px minimum touch targets for better accessibility
- **Mobile FAB**: Floating action button for quick note creation
- **Collapsible Forms**: Space-efficient mobile interfaces
- **Safe Area Support**: Proper handling of device notches and home indicators

## Customization

The color palette is fully customizable through CSS custom properties in `globals.css`. The design system uses semantic tokens that automatically adapt to both light and dark themes.

## License

MIT License - feel free to use this project as a starting point for your own applications.
