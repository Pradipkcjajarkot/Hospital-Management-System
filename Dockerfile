FROM php:8.3-fpm-alpine AS base

WORKDIR /app

RUN apk add --no-cache \
    libpng-dev libzip-dev oniguruma-dev freetype-dev \
    icu-dev libwebp-dev jpegoptim optipng pngquant curl

RUN docker-php-ext-install pdo_mysql mysqli mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

FROM base AS builder

RUN apk add --no-cache nodejs npm

COPY . .

RUN cp .env.example .env || true

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN php artisan key:generate

RUN npm ci && npm run build

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

FROM base AS runtime

COPY --from=builder /app /app

COPY docker-start.sh /docker-start.sh
RUN chmod +x /docker-start.sh

CMD ["/docker-start.sh"]
