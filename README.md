# peterchrjoergensen.dk
My personal website

## Installation

1. If HTTPS is not supported, remove the following lines from the `.htaccess` file.

``` 
RewriteCond %{HTTPS} !on
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

In addition, you must also change the reference to HTTPS in `RewriteRule ^(.*)$ https://%1/$1 [R=301,L]` to `RewriteRule ^(.*)$ http://%1/$1 [R=301,L]` as to redirect correctly to HTTP.


