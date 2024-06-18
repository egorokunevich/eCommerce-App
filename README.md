# eCommerce-App "Coffee Loop" ☕🔄

Coffee Loop is your one-stop destination for all things coffee, tea, and everything in between! 🚀

## Overview

Coffee Loop is an eCommerce application designed to provide users with a comprehensive and interactive shopping experience. From browsing through a vast selection of products to seamless checkout, our platform ensures a smooth journey for every user. Whether you're a coffee connoisseur, tea enthusiast, or simply looking for quality brewing accessories, Coffee Loop has got you covered.

## Features

- **_Product Discovery_**: Browse through a diverse range of products, including coffee beans, tea leaves, equipment, and more. 📚👗👟
- **_Detailed Descriptions_**: View detailed descriptions and specifications of each product to make informed purchasing decisions. 🔍
- **_Easy Checkout_**: Add your favorite items to the basket with just a click and proceed to checkout seamlessly. 💳
- **_User Authentication_**: Register and log in to your account to access personalized recommendations and order history. 📝🔐
- **_Responsive Design_**: Enjoy a seamless shopping experience on various devices, including desktops, tablets, and smartphones. 📲

## Technology Stack

Coffee Loop is built using modern technologies to ensure performance, scalability, and maintainability. Our tech stack includes:

- **_Typescript_**: Provides type-checking capabilities and improves code quality.
- **_Eslint & Prettier_**: Enforce code style consistency and best practices.
- **_Husky_**: Implements Git hooks for automated code linting and formatting.
- **_Vite_**: Lightning-fast build tool for modern web development.
- **_Vitest_**: Efficient testing framework for unit and integration testing.

## Libraries

We have used libraries in our project:

- **_@control.ts/min_**: UI library for building modern web applications with ease. It simplifies the process of creating dynamic user interfaces.
- **_popperjs/core_**: A library that helps you position any UI element that "pops out" from the flow of your document.
- **_nouislider_**: A lightweight JavaScript range slider with full touch support.
- **_swiper_**: A library for building complex touch galleries on websites, web apps and mobile apps.
- **_toastify-js_**: A pure JavaScript library that lets you create notifications toasts/messages.
- **_vanilla-routing_**: A lightweight and versatile routing solution designed for vanilla JavaScript web applications. 


## Available Scripts

### `npm run start`

Starts the development server using Vite.

### `npm run build`

Builds the application for production using Vite.

### `npm run preview`

Previews the production build locally using Vite.

### `npm run prettier`

Checks code formatting using Prettier for files in the `src` directory.

### `npm run prettier:fix`

Fixes code formatting using Prettier for files in the `src` directory.

### `npm run lint`

Lints the code using ESLint for files in the `src` directory.

### `npm run lint:fix`

Fixes linting errors using ESLint for files in the `src` directory.

### `npm run formatAll`

Runs code formatting and linting fixes for files in the `src` directory.

### `npm run prepare`

Runs Husky to set up Git hooks for code formatting and linting.

### `npm run tsc`

Type-checks the TypeScript files.

### `npm run pre-commit`

Runs before committing changes. Checks code formatting using Prettier.

### `npm run pre-push`

Runs before pushing changes. Checks code formatting using Prettier, performs linting, runs tests, and type-checks the TypeScript files.

### `npm run test:watch`

Watches for changes and runs tests using Vitest in watch mode.

### `npm run test`

Runs tests using Vitest.

### `npm run test:coverage`

Runs tests using Vitest and displays how much code is covered with tests.

### `npm run predeploy`

Runs before deploying the application. Builds the project.

### `npm run deploy`

Deploys the application to GitHub Pages. Builds the project and publishes the `dist` folder to the `eCommerce-App` branch.

# Installing the Project:

If you have copied configs files, run `npm i`

If you install the project by yourself:

## 1. Install Vite

- run `npm init vite@latest`
- select `vanilla`
- select `typescript`
- create file `vite.config.ts`

## 2. Install TypeScript

- run `npm i -D typescript`
- create file `tsconfig.json`
- run `npx tsc --init`
- run `npm i --save-dev vite-tsconfig-paths`

## 3. Install Eslint

- run `npm install --save-dev eslint` installs ESLint as a development dependency for the project
- run `npm i -D @typescript-eslint/parser` installs the TypeScript parser for ESLint. It allows ESLint to understand TypeScript syntax and perform linting on TypeScript files.
- run `npm i -D @typescript-eslint/eslint-plugin` installs the TypeScript ESLint plugin as a development dependency. The plugin provides additional rules and functionality specific to TypeScript linting.
- run `npm install --save-dev eslint-config-airbnb eslint-config-prettier eslint-plugin-html eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier prettier` installs various ESLint-related packages and configurations:

  - `eslint-config-airbnb`: Airbnb's ESLint configuration, which provides a set of rules for maintaining code quality and style based on Airbnb's JavaScript style guide.
  - `eslint-config-prettier`: Configuration that disables ESLint rules that may conflict with Prettier, a code formatter. It ensures that ESLint and Prettier work together smoothly.
  - `eslint-plugin-html`: ESLint plugin for linting HTML files. It allows ESLint to analyze and report issues in HTML code.
  - `eslint-plugin-import`: ESLint plugin that provides linting rules for ES2015+ (ES6+) import/export syntax and module resolution.
  - `eslint-plugin-jsx-a11y`: ESLint plugin that provides accessibility linting rules for JSX elements.
  - `eslint-plugin-prettier`: Plugin that integrates ESLint with Prettier. It formats code using Prettier as an ESLint rule.
  - `prettier`: Code formatter that enforces a consistent code style by parsing JavaScript/TypeScript code and reprinting it with its own rules.

- create file `.eslintrc.json`

## 4. Install Prettier

- run `npm install --save-dev --save-exact prettier`
- create file `.prettierrc`
- create file `.prettierignore`

## 5. Config Husky

- run `npm install --save-dev husky`
- run `npx husky init`
- run once `npm run prepare`

## 6. Install Resolver for Eslint-Typescript

- run `npm install -D eslint-import-resolver-typescript`

## 7. Install Validate-branch-name

- run `npm install validate-branch-name -D`
- create file `.validate-branch-namerc.json`

`  {
    "pattern": "^(feat|fix|chore|refactor|docs)/RSS-ECOMM-(\\d)_(\\d+)_\\w+",
    "errorMsg": "Branch name doesn't follow the defined repository rules"
  }`

Make sure:

file .husky/pre-commit contains:
`npx validate-branch-name`

file .husky/pre-push contains:
`npm run pre-push`

## 8. Install Vitest

- run `npm install -D vitest` (Vitest 1.0 requires Vite >=v5.0.0 and Node >=v18.0.0)
- run `npm install -D @vitest/coverage-v8` (This is used for checking test coverage)
- create file `vitest.config.ts` (it will have the higher priority, then vite.config.ts)

if you need to create file package.json, run `npm init -y`
