import { initApp } from './index';
import { Express } from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';

const PORT = process.env.PORT || 8080;

initApp()
  .then((app: Express) => {
    if (process.env.ENV === 'development') {
      http
        .createServer(app)
        .listen(PORT, () =>
          console.log(`Server is running on http://${process.env.DOMAIN_BASE || 'localhost'}:${PORT}`),
        );
    } else if (process.env.ENV === 'production') {
      const options = {
        key: fs.readFileSync('../key.pem'),
        cert: fs.readFileSync('../cert.pem'),
      };
      https
        .createServer(options, app)
        .listen(PORT, () =>
          console.log(`Server is running on https://${process.env.DOMAIN_BASE || 'localhost'}:${PORT}`),
        );
    }
  })
  .catch((err) => {
    console.error('Failed to run server:', err);
    process.exit(1);
  });
