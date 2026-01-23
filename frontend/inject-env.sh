#!/bin/sh
set -e

# Generate runtime config file with environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV = {
  VITE_API_URL: "${VITE_API_URL}"
};
EOF

echo "Injected runtime config: VITE_API_URL=${VITE_API_URL}"
