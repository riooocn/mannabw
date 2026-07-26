FROM php:8.3-apache

# Install dependencies for Laravel and PostgreSQL (Supabase)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd intl zip

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# Change Apache document root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first to leverage Docker layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies (excluding dev tools)
RUN composer install --optimize-autoloader --no-dev --no-scripts

# Copy all project files to container
COPY . .

# Run composer dump-autoload to optimize the autoloader with all files
RUN composer dump-autoload --optimize

# Fix permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Setup Apache to listen on dynamic $PORT provided by Koyeb (Default 8000)
ENV PORT=8000
RUN sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
RUN sed -i "s/:80/:\${PORT}/g" /etc/apache2/sites-available/000-default.conf

EXPOSE 8000
