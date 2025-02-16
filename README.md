# GraphQL Profile Dashboard

A modern Next.js web application that displays user profile information and statistics using GraphQL. The application features a secure login system and interactive visualizations of user data.

## Features

- Secure authentication with JWT
- Interactive data visualizations using SVG
- Real-time data fetching with GraphQL
- Responsive design with Tailwind CSS
- Modern, clean UI
- Server-side rendering with Next.js

## Visualizations

- XP Progress Line Chart
- Technical Skills Radar Chart
- Programming Languages Radar Chart
- Audit Ratio Statistics

## Project Structure

```
graphql/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Header/
│   │   └── BreadCrumbs/
│   ├── graphql/          # GraphQL configuration
│   │   ├── client.tsx    # Apollo client setup
│   │   └── queries.tsx   # GraphQL queries
│   ├── hooks/            # Custom React hooks
│   │   ├── useColorMode.tsx
│   │   └── useLocalStorage.tsx
│   ├── pages/            # Application pages
│   │   ├── _app.tsx
│   │   ├── login/
│   │   └── dashboard/
│   └── styles/           # Styling
│       └── globals.css
├── public/               # Static assets
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. The login page accepts both username/password and email/password combinations.

## API Integration

The application integrates with the GraphQL API endpoint at `https://learn.reboot01.com/api/graphql-engine/v1/graphql`. All data queries are handled through Apollo Client using proper authentication headers.

## Data Visualization

The visualization system is built using modern charting libraries and SVG, providing smooth animations and interactions. The system includes:

- Line Chart implementation for XP progression
- Pie Chart for skills visualization
- Interactive tooltips
- Responsive design with automatic resizing

## Styling

The application uses Tailwind CSS for styling with:

- Custom theme configuration
- Responsive design system
- Dark mode support
- Component-based organization
- Mobile-first approach

## Browser Support

The application supports all modern browsers that implement standard ES6+ features and modern CSS properties.

## Development

To modify or extend the application:

1. All visualization components are in `src/pages/dashboard/components/Charts`
2. Authentication handling is in the login components
3. GraphQL setup is in `src/graphql/client.tsx`
4. GraphQL queries are in `src/graphql/queries.tsx`

## License

MIT License
