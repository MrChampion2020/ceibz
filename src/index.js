
// // index.js or App.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Helmet>
      <title>Christ Embassy Ibadan Zone 1 | Global Christian Ministry</title>
      <meta
        name="description"
        content="Join Christ Embassy Ibadan Zone 1, a vibrant Christian church offering spiritual guidance and community services. Discover churches around the world with us."
      />
      <link rel="canonical" href="https://ceibz1.com/" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "PlaceOfWorship",
            "name": "Christ Embassy Ibadan Zone 1",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "CVHQ+R4, Ibadan 200285, Oyo State Nigeria",
              "addressLocality": "Ibadan",
              "addressRegion": "Oyo",
              "postalCode": "200285",
              "addressCountry": "NG"
            },
            "telephone": "+234 803 123 4567",
            "url": "https://ceibz1.com/",
            "description": "A place of Healing and Solutions, A global Christian ministry offering worship services, community outreach, and spiritual guidance."
          }
        `}
      </script>
    </Helmet>
    <App />
  </BrowserRouter>
);

reportWebVitals();