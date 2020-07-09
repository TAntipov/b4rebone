Run
===============================
NodeJS 14.05
NPM 6.14.5
Webpack 4.43.0
Webpack-cli 3.3.12

```npm i``` instal dependencies  

```npm run dev``` runs browsersync static server

```npm run build``` puts optimized bunle into ```build``` dir

Add font face 
-------------------------------
```+font('Roboto-Regular','Roboto/Roboto-Regular')```
Font files must be in ```assets/fonts/```

Path aliases
-------------------------------
You can use aliases in PUG templates in ```img:src```, ```use:xlink:href```, ```source:srcset``` tags 
and CSS files.

- ~assets
- ~img
- ~svg
- ~fonts
- ~styles
- ~templates

> Example:
> In PUG template
> ```img(src="~img/logo.png")```
> transforms to: 
> ```<img src="/assets/img/logo.png">```

SVG Sprite
-------------------------------
All used files in ```~svg/icons``` adding to ```build/assets/svg/sprite.svg``` automatically.

> Example: 
> In PUG template
> ```use(xlink:href='~svg/icons/cart.svg')```
> transforms to
> ```
> <svg class="layout__header__cart__icon">
>     <use xlink:href="assets/svg/sprite.svg#icon-cart"></use>
> </svg>
> ``` 