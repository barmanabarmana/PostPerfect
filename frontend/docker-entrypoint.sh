#!/bin/sh
set -e

# Replace PORT placeholder in nginx config with actual PORT from Railway
# If PORT is not set, default to 80
PORT=${PORT:-80}

# Update nginx config to listen on the correct port
sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/conf.d/default.conf

# Inject runtime environment variables
/inject-env.sh

# Start nginx
exec nginx -g 'daemon off;'
