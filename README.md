## Developing
```sh
# next js dev server
yarn dev

# tailwind watch and compile
ls css/*.tailwind.css | entr npx tailwindcss build css/*.tailwind.css -o css/bundle.css
```

## Deploying
- TODO setup GH action to push to S3
- TODO setup purgecss; see https://github.com/tailwindlabs/tailwindcss-setup-examples/tree/master/examples/nextjs
- TODO setup purgecss in development and add as script in package.json
