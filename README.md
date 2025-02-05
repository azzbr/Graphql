# GraphQL Profile Dashboard

A modern web application that displays user profile information and statistics using GraphQL. The application features a secure login system and interactive visualizations of user data.

## Features

- Secure authentication with JWT
- Interactive data visualizations using SVG
- Real-time data fetching with GraphQL
- Responsive design
- Modern, clean UI

## Visualizations

- XP Progress Line Chart
- Technical Skills Radar Chart
- Programming Languages Radar Chart
- Audit Ratio Statistics

## Project Structure

```
graphql/
├── public/
│   └── index.html          # Entry point
├── src/
│   ├── js/
│   │   ├── auth/
│   │   │   └── authService.js
│   │   ├── api/
│   │   │   └── graphqlClient.js
│   │   ├── utils/
│   │   │   └── dataTransformers.js
│   │   └── visualizations/
│   │       ├── Chart.js
│   │       ├── LineChart.js
│   │       └── RadarChart.js
│   ├── css/
│   │   ├── components/
│   │   │   └── forms.css
│   │   └── main.css
│   └── pages/
│       ├── login.html
│       └── profile.html
└── README.md
```

## Setup

1. Clone the repository
2. Open the project directory
3. Serve the files using a local development server

Example using Python's built-in HTTP server:
```bash
python -m http.server
```

Or using Node.js's http-server:
```bash
npx http-server
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. The login page accepts both username/password and email/password combinations.

## API Integration

The application integrates with the GraphQL API endpoint at `https://learn.reboot01.com/api/graphql-engine/v1/graphql`. All data queries are handled through this endpoint using proper authentication headers.

## Data Visualization

The visualization system is built using native SVG, providing smooth animations and interactions. The system includes:

- Base Chart class with common SVG operations
- LineChart implementation for XP progression
- RadarChart implementation for skills visualization
- Interactive tooltips
- Responsive design with automatic resizing

## Styling

The application uses a modern CSS architecture with:

- CSS Custom Properties (variables) for theming
- Responsive grid system
- Utility classes
- Component-based CSS organization
- Mobile-first approach

## Browser Support

The application supports all modern browsers that implement standard ES6+ features and modern CSS properties.

## Development

To modify or extend the application:

1. All visualization logic is in the `src/js/visualizations` directory
2. Authentication handling is in `src/js/auth/authService.js`
3. GraphQL queries are centralized in `src/js/api/graphqlClient.js`
4. Data transformation utilities are in `src/js/utils/dataTransformers.js`

## License

MIT License
