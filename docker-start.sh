#!/bin/sh
set -e

cat > .env << EOF
APP_KEY=$(grep ^APP_KEY .env | head -1)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://${RAILWAY_PUBLIC_DOMAIN:-localhost}
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST:-mysql}
DB_PORT=${MYSQLPORT:-3306}
DB_DATABASE=${MYSQLDATABASE:-railway}
DB_USERNAME=${MYSQLUSER:-root}
DB_PASSWORD=${MYSQLPASSWORD:-}
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
MAIL_MAILER=${MAIL_MAILER:-log}
MAIL_HOST=${MAIL_HOST:-}
MAIL_PORT=${MAIL_PORT:-}
MAIL_USERNAME=${MAIL_USERNAME:-}
MAIL_PASSWORD=${MAIL_PASSWORD:-}
MAIL_ENCRYPTION=${MAIL_ENCRYPTION:-}
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS:-}
MAIL_FROM_NAME=${MAIL_FROM_NAME:-}
RESEND_API_KEY=${RESEND_API_KEY:-}
EOF

php artisan config:clear 2>/dev/null

for i in $(seq 1 30); do
  php artisan migrate --force 2>/dev/null && break
  echo "Waiting for MySQL..."
  sleep 2
done

php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
