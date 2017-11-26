# peterchrjoergensen.dk

![StyleCI](https://styleci.io/repos/96241363/shield)
[![Website](https://img.shields.io/website-up-down-green-red/https/peterchrjoergensen.dk.svg?label=Website&style=flat-square)](https://peterchrjoergensen.dk/)
[![Release](https://img.shields.io/github/release/tehwave/peterchrjoergensen.dk.svg?label=Release&style=flat-square)](https://github.com/tehwave/peterchrjoergensen.dk/releases)

This is the repository for my personal website.

## Demo

https://peterchrjoergensen.dk

## Installation

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

    cd /home/forge/peterchrjoergensen.dk

    if [ -f artisan ]
    then
        php artisan down
    fi

    git pull origin master
    composer install --no-interaction --prefer-dist --optimize-autoloader

    if [ -f artisan ]
    then
        php artisan migrate --force

        php artisan cache:clear
        php artisan view:clear

        php artisan config:cache
        php artisan route:cache

        php artisan queue:restart
    fi

    echo "" | sudo -S service php7.1-fpm reload

    if [ -f artisan ]
    then
        php artisan up
    fi

### Environment

```.env.example``` represents the environment variables for production. Sensitive information has been redacted, and must be replaced with their correct values.

## Development

The website is developed using Laravel PHP framework, Composer PHP dependency manager, JQuery JavaScript library, Bootstrap front-end component library and SASS CSS extension language.

For more information on how I developed the website, please visit [my blog](https://peterchrjoergensen.dk/blog/).

If you would like to contribute by filing an issue or sending a pull request, please feel free to do so.

I would be happy to answer any questions, that you might have regarding the website, via Twitter [@tehwave](https://twitter.com/tehwave).

## Credit

- [Peter Christian Jørgensen](https://github.com/tehwave)
- [All Contributors](../../contributors)

## License

2017 © Peter Christian Jørgensen. All Rights Reserved.