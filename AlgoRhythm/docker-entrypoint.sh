#!/bin/sh

if [ -f /usr/share/nginx/html/config.js ]; then
  echo "Replacing environment variables in config.js..."

  sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" /usr/share/nginx/html/config.js
  sed -i "s|__ANALYZER_URL__|${ANALYZER_URL}|g" /usr/share/nginx/html/config.js
  sed -i "s|__VISUALIZER_URL__|${VISUALIZER_URL}|g" /usr/share/nginx/html/config.js
  sed -i "s|__GOOGLE_CLIENT_ID__|${GOOGLE_CLIENT_ID}|g" /usr/share/nginx/html/config.js

  echo "Environment variables replaced successfully"
  cat /usr/share/nginx/html/config.js
else
  echo "Warning: config.js not found"
fi

exec "$@"