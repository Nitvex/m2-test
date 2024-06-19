# M2 technical task
In order to run the project:
```
npm install
npm run dev
```

To run the tests:
```
npm run test
```

Technology stack used: React.js, CSS, ChartJs, TypeScript, Vite.js.  
There is no any state manager as the project is quite simple and there is no shared state in multiple pages.  
The usage of technologies is explained by application simplicity and time constraints. All of these technologies are well-known, established and do not require a lot of time to setup.


Project structure:
```
./src
-- /api/ – Utility functions for sending requests to external services
-- /components/ – Components reused across pages
-- /pages/ – Pages components
```

> NOTE: There are low quotas for API usage as I didn't buy any kind of subscription. These quotas may result in 429 errors in short period of time.  
> Bear in mind, that page reloads and moves from one page to another will cause API calls.  
> My personal API token is already hardcoded in constants for your convenience. Do not hesitate to use it, because even if you run out of quotas, no additional charges will be applied to me as it is free subscription.

I've aimed for ~4-6 hours timefrime. Due to this limitation the following is NOT done:  
– Mobile/responsive UI support  
– Proper error handling and retries  
– Any kind of performance optimizations, like lazy loading, caching, etc.  
– e2e-tests with Playwright/Cypress, etc.