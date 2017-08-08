# peterchrjoergensen.dk

This is the repository for my personal website. Some elements may have been excluded in interest of privacy and security.

## Demo

https://peterchrjoergensen.dk

## Installation

### Build

The website uses Gulp to process CSS and images. Images should be placed in the `resources/src` folder if they are to be processed.

1. Production

```
npm run prod
```

2. Development

The following command will watch for changes.

```
npm run dev
```

### Deployment

```
git pull origin master
composer install --no-interaction --prefer-dist --optimize-autoloader
```

### HTTPS

1. If HTTPS is not supported, you must set `RewriteCond %{HTTPS} !on` to `!off` in the following lines from the `.htaccess` file.

```
RewriteCond %{HTTPS} !on
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

2. In addition, you must also change the reference to HTTPS in `RedirectMatch 301 ^/blog/(.*)$ https://blog.peterchrjoergensen.dk/$1` to redirect correctly to `http://` if above holds true.

## Development

The website is developed using Flight PHP framework, JQuery JavaScript library and SASS CSS post-processing tool.

For more information on how I developed the website, please visit [my blog](https://blog.peterchrjoergensen.dk).

If you would like to contribute by filing an issue or sending a pull request, please feel free to do so.

I would be happy to answer any questions, that you might have regarding the website, via Twitter [@tehwave](https://twitter.com/tehwave).

## Credit

- [Peter Christian Jørgensen](https://github.com/tehwave)
- [All Contributors](../../contributors)

## License

2017 (c) Peter Christian Jørgensen. All Rights Reserved.