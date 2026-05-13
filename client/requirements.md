## Packages
recharts | Data visualization (donut and bar charts)
framer-motion | Animations for transitions and interactions
date-fns | Date formatting for recent scans

## Notes
API endpoints:
- POST /api/analyze: Takes { content: string }, returns Scan object
- GET /api/scans: Returns list of Scan objects
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
