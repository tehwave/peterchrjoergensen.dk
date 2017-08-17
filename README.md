# peterchrjoergensen.dk

![StyleCI](https://styleci.io/repos/96241363/shield)
[![Website](https://img.shields.io/website-up-down-green-red/https/peterchrjoergensen.dk.svg?label=Website&style=flat-square)](https://peterchrjoergensen.dk/)
[![Release](https://img.shields.io/github/release/tehwave/peterchrjoergensen.dk.svg?label=Release&style=flat-square)](https://github.com/tehwave/peterchrjoergensen.dk/releases)

This is the repository for my personal website. Some elements may have been excluded in the interest of privacy and security.

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
npm run build
```

Images and stylesheets should be placed in their respective folders in the `resources/src` directory if they are to be processed.

### Deployment

Pull the latest changes from the `master` branch.

```
git pull origin master
```

Composer is not currently available on my hosting service, so I include the `vendor` directory.

### HTTPS

If HTTPS is not supported, you must set `RewriteCond %{HTTPS} !on` to `!off` in the following lines from the `.htaccess` file.

```
RewriteCond %{HTTPS} !on
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

In addition, you must also change the reference to HTTPS in `RedirectMatch 301 ^/blog/(.*)$ https://blog.peterchrjoergensen.dk/$1` to redirect correctly to `http://` if above holds true.

## Development

The website is developed using Flight PHP framework, Composer PHP dependency manager, Gulp building toolkit, JQuery JavaScript library, Bootstrap front-end component library and SASS CSS extension language.

For more information on how I developed the website, please visit [my blog](https://blog.peterchrjoergensen.dk).

If you would like to contribute by filing an issue or sending a pull request, please feel free to do so.

I would be happy to answer any questions, that you might have regarding the website, via Twitter [@tehwave](https://twitter.com/tehwave).

## Credit

- [Peter Christian Jørgensen](https://github.com/tehwave)
- [All Contributors](../../contributors)

## License

2017 (c) Peter Christian Jørgensen. All Rights Reserved.
