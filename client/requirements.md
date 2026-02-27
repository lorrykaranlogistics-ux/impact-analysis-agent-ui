## Packages
axios | Required for API communication with interceptors for JWT auth as specified
recharts | For rendering the risk score gauge/charts in the analysis results
framer-motion | For smooth, premium page transitions and staggered reveals of analysis results

## Notes
- Axios is configured to use VITE_API_BASE_URL or fallback to http://localhost:8000
- Auth token is stored in localStorage as 'access_token'
- Axios interceptor handles 401s by clearing token and redirecting to /login
- Last successful analysis is cached in localStorage under 'last_analysis_result'
