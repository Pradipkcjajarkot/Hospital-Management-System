#!/bin/sh
set -e

echo "=== Railway Deploy Debug ==="
echo "PORT=$PORT"
echo "RAILWAY_PUBLIC_DOMAIN=$RAILWAY_PUBLIC_DOMAIN"
echo "MYSQLHOST=$MYSQLHOST"
echo "MYSQLPORT=$MYSQLPORT"
echo "MYSQLDATABASE=$MYSQLDATABASE"
echo "MYSQLUSER=$MYSQLUSER"
echo "MYSQLPASSWORD is set: $(if [ -n "$MYSQLPASSWORD" ]; then echo 'YES'; else echo 'NO'; fi)"
echo "==========================="

touch /app/database/database.sqlite

if [ -n "$MYSQLHOST" ]; then
  DB_CONNECTION=mysql
  DB_HOST=$MYSQLHOST
  DB_PORT=${MYSQLPORT:-3306}
  DB_DATABASE=${MYSQLDATABASE:-railway}
  DB_USERNAME=${MYSQLUSER:-root}
  DB_PASSWORD=${MYSQLPASSWORD:-}
else
  DB_CONNECTION=sqlite
  DB_HOST=""
  DB_PORT=""
  DB_DATABASE=/app/database/database.sqlite
  DB_USERNAME=""
  DB_PASSWORD=""
fi

cat > .env << EOF
APP_KEY=
APP_ENV=production
APP_DEBUG=true
APP_URL=https://${RAILWAY_PUBLIC_DOMAIN:-localhost}
ASSET_URL=https://${RAILWAY_PUBLIC_DOMAIN:-localhost}
DB_CONNECTION=${DB_CONNECTION}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
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

php artisan key:generate 2>&1
php artisan config:clear 2>/dev/null

php artisan migrate --force 2>&1 &
php artisan db:seed --force 2>&1 &

php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
