# apps/api/Dockerfile — Laravel API (pure backend, port 8000)

FROM php:8.4-cli-alpine

WORKDIR /var/www

# curl: docker-compose healthcheck
# postgresql-dev / libzip-dev / oniguruma-dev: build deps for the PHP
# extensions Laravel needs (pdo_pgsql, zip, mbstring)
# git / unzip: required by Composer
RUN apk add --no-cache \
    curl \
    git \
    unzip \
    postgresql-dev \
    libzip-dev \
    oniguruma-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        zip \
        mbstring \
        bcmath \
        pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del $PHPIZE_DEPS

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dependencies first — layer cache only busts on composer.* changes.
# Paths are relative to the build context, which docker-compose.yml sets
# to the repo root (context: .) — not apps/api itself.
COPY apps/api/composer.json apps/api/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY apps/api/ .

RUN composer dump-autoload --optimize \
    && php artisan config:clear

# Ecommerce storage dirs — must match the *_STORAGE_DIR vars in
# docker-compose.yml's x-laravel-env block (PRODUCT_MEDIA_STORAGE_DIR,
# INVOICE_STORAGE_DIR, RECEIPT_STORAGE_DIR, DOCUMENT_STORAGE_DIR).
# Note: with FILESYSTEM_DISK=s3 these end up unused for actual uploads
# (MinIO handles that) but Laravel still expects the local paths to
# exist for any disk('local') fallback, log files, and framework dirs.
RUN mkdir -p storage/product-media storage/invoices storage/receipts storage/documents \
    storage/framework/sessions storage/framework/views storage/framework/cache \
    storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=5s --retries=10 --start-period=15s \
    CMD curl -f http://localhost:8000/up || exit 1

# artisan serve is fine here since nginx sits in front as the reverse
# proxy — but it's still single-threaded PHP, not built for heavy
# concurrent production load. Swap to php-fpm (or Octane) behind nginx
# if/when traffic needs it.
#
# Note: horizon and scheduler (docker-compose.yml) build from this same
# image but override CMD, so they don't run this migrate step — they
# only depend_on db/redis being healthy, not on this migration finishing.
# On a cold start it's possible for a queue worker to come up before
# migrations land. Fine for solo local dev; if it bites you, move the
# migrate step into a one-shot init service (same pattern as
# minio-init) that api/horizon/scheduler all depend_on.
CMD php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8000
