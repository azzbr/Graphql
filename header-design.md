# Header Component Design

## Overview
A clean, minimal header that displays personalized user information at the top of the dashboard.

## Layout
- Fixed position at the top of the page
- Light background with subtle shadow for depth
- Padding: 1rem on all sides
- Full width
- Flexbox layout for content alignment

## Content Elements

### Welcome Message
- Format: "Welcome, [FirstName] [LastName]"
- Font: Medium weight
- Color: Primary text color
- Size: 1.125rem (18px)

### User Information
- Campus: "[CampusName]"
- Level: "Level [X]"
- Font: Regular weight
- Color: Secondary text color
- Size: 0.875rem (14px)

### Profile Icon
- Simple circular avatar
- Size: 2.5rem (40px)
- Border: 1px solid border color
- Background: Light gray if no image

## Styling
```css
/* Tailwind classes to be used */
.header {
  @apply sticky top-0 z-50 w-full bg-white px-4 py-3 shadow-sm dark:bg-boxdark;
}

.header-content {
  @apply flex items-center justify-between;
}

.welcome-text {
  @apply text-lg font-medium text-black dark:text-white;
}

.user-info {
  @apply text-sm text-body dark:text-bodydark;
}

.profile-icon {
  @apply h-10 w-10 rounded-full border border-stroke bg-gray-100 dark:border-strokedark dark:bg-meta-4;
}
```

## Data Requirements
The header component will need access to:
- User's first name
- User's last name
- Campus information
- Current level
- Profile image (optional)

## Component Location
- Path: `src/components/Header/index.tsx`
- Import in: `src/components/Layout.tsx`

## Implementation Notes
1. Keep the header lightweight and performant
2. Maintain responsive design for all screen sizes
3. Ensure dark mode compatibility
4. Use existing user data from the dashboard state
5. No interactive elements needed - purely informational