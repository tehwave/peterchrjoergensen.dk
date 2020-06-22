# peterchrjoergensen.dk

![StyleCI](https://styleci.io/repos/96241363/shield)
[![Website](https://img.shields.io/website-up-down-green-red/https/peterchrjoergensen.dk.svg?label=Website&style=flat-square)](https://peterchrjoergensen.dk/)
[![Release](https://img.shields.io/github/release/tehwave/peterchrjoergensen.dk.svg?label=Release&style=flat-square)](https://github.com/tehwave/peterchrjoergensen.dk/releases)

This is the repository for my personal website.

## Demo

https://peterchrjoergensen.dk

## Requirements

- Redis
- Composer
- PHP >= 7.2
- MySQL >= 5.7
- Laravel >= 5.8

### Packages

- Laravel Nova >= 2.0

### PHP Extensions

- ext-curl: *
- ext-json: *

## Installation

Add Laravel Nova credentials to `auth.json`.

```bash
composer config http-basic.nova.laravel.com <USERNAME> <PASSWORD>
```

Install the packages.

```bash
composer install
```

Link storage to public.

```bash
php artisan storage:link
```

### Build

Install the dependencies.

```
npm install
```

Process and build assets.

```
npm run prod
```

Develop in a local environment.

```
npm run watch
```

### Deployment

Deploy Script for Laravel Forge

```bash
cd /home/forge/peterchrjoergensen.dk

php artisan down

git pull origin master

composer install --no-interaction --prefer-dist --optimize-autoloader

php artisan migrate --force

npm ci

npm run production

php artisan cache:clear
php artisan view:clear

php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

echo "" | sudo -S service php7.4-fpm reload

php artisan up
```

Replace ```php7.4-fpm``` with the version of PHP installed on the server.

### Environment

```.env.example``` represents the environment variables for production.

Sensitive values has been redacted. They must be replaced with their correct values.

### NGINX

Add the following lines to the NGINX configuration to cache assets, media, etc.

```
# assets, media
location ~* \.(?:css(\.map)?|js(\.map)?|jpe?g|png|gif|ico|cur|heic|webp|tiff?|mp3|m4a|aac|ogg|midi?|wav|mp4|mov|webm|mpe?g|avi|ogv|flv|wmv)$ {
    expires 1M;
    access_log off;
}
```

```
# svg, fonts
location ~* \.(?:svgz?|ttf|ttc|otf|eot|woff2?)$ {
    add_header Access-Control-Allow-Origin "*";
    expires 1M;
    access_log off;
}
```

## About

The website is developed using Laravel PHP framework, Composer PHP dependency manager, JQuery JavaScript library, Bootstrap front-end component library and SASS CSS extension language.

For more information on how I developed the website, please visit [my blog](https://peterchrjoergensen.dk/blog/).

If you would like to contribute by filing an issue or sending a pull request, please feel free to do so.

I would be happy to answer any questions, that you might have regarding the website, via Twitter [@tehwave](https://twitter.com/tehwave).

## Credit

- [Peter Christian Jørgensen](https://github.com/tehwave)
- [All Contributors](../../contributors)

## License

© Peter Christian Jørgensen. All Rights Reserved.
