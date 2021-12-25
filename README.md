# Tourz Naija Platform

[![Build Status](https://app.travis-ci.com/philz-stizles/tourz-node-mvc.svg?branch=main)](https://app.travis-ci.com/philz-stizles/tourz-node-mvc)

## Introduction

This is an Tours platform where users can signup as tour guides and user can book tours.

## Contents

1. [Technologies](#technologies)
2. [Features](#technologies)
3. [Typescript](#typescript)
4. [Eslint](#eslint)
5. [Prettier](#prettier)
6. [Jest](#jest)
7. [Environment Variables](#environment-variables)
8. [File Uploads](#file-uploads)
9. [Bull](#bull)
10. [Redis](#redis)
11. [GraphQL](#graphql)
12. [Socket.io](#socket.io)
13. [AWS](#aws)
14. [SMS](#sms)
15. [Caching](#caching)
16. [Pre-Deployment](#pre-deployment)
17. [Deployment](#deployment)
18. [Swagger Documentation](#swagger-documentation)
19. [Security issues and best practices](#security-issues-and-best-practices)
20. [Compatibility information](#compatibility-information)

## Technologies

- Node, Express, REST, MVC, GraphQL, Sockets
- Dev Tools: Typescript, Eslint, Prettier
- Testing: Jest, Istanbul, Supertest
- Server: AWS, EC2, Serverless
- Messaging: SES, Twilio
- Storage: S3, Cloudinary
- Template Engine: Pug
- Database: MongoDB("mongoose": "^5.13.0"), Redis
- Deployment: Docker

## Features

- Multitenancy
- Authentication, Authorization
- Crone jobs, and schedulers
- GraphQL DataSources
- Testing and coveralls

## Typescript

- Overview:
  - Helps us catch errors during development
  - Only active during development
  - Does not provide any performance optimization
  - Neither your browser nor node JS know what typescript is
  - Typescript compiler reads our code, checks for errors and convert it to plain js
- Install packages:
  - npm install -g typescript ts-node
  - npm install -D typescript ts-node tsconfig-paths @types/node @types/express
  - npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
- Create tsconfig file: npx tsc --init

## Eslint

- Install vscode eslint plugin
- Recommendation to install eslint on a local level: npm install -D eslint
- Configure eslint: npx eslint -init

  - To check syntax, find problems, and enforce code style
  - JavaScript modules (import/export)
  - Which framework does your project use? None of these
  - Does your project use TypeScript? » Yes
  - Where does your code run? Node
  - How would you like to define a style for your project?
    Use a popular style guide
    Airbnb: https://github.com/airbnb/javascript
  - What format do you want your config file to be in? JavaScript
  - Would you like to install them now with npm? » Yes

- Create .eslintignore file: touch .eslintignore
  add:
  node_modules
  dist
  coverage

- Install import resolver(optional): npm install -D eslint-import-resolver-typescript tsconfig-paths
- Reload vscode for configurations to kick in: ctrl + shift + p > reload

## Prettier

- Install vscode eslint plugin
- Install prettier in project: npm install -D prettier

  {
  "semi": true,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "jsxBracketSameLine": true
  }

- Install prettier eslint plugins: npm install -D eslint-config-prettier eslint-plugin-prettier

## Jest

- Install dependencies:

  ```bash
    npm install -D jest ts-jest @types/jest supertest @babel/preset-typescript
  ```

- Configure jest:

  ```bash
    npx ts-jest config:init
  ```

- Add your configs to 'jest.config.js'
- Configure '.eslintrc.js':

  env: {
  ...
  jest: true,
  },

- Configure 'package.json'
  "test": "jest",
  "test:watch": "jest --watchAll",
  "test:coverage": "jest --coverage",
- Run test: npm run test

## Environment Variables

- install packages
  npm i dotenv-safe
  npm i --save-dev @types/dotenv-safe
- Create files '.env.example' and '.env'

## File Uploads

- multer - for parsing, validation etc
- formidable
- sharp:
  - description: for resizing
  - installation:
    npm install sharp | yarn add sharp
    [typescript] npm install @types/sharp | yarn add @types/sharp
- cloudinary:
- aws sdk

## Bull

## Redis

## GraphQL

Install packages:

    npm install @graphql-tools/load-files @graphql-tools/schema @graphql-tools/utils
    npm install apollo-datasource-mongodb
    npm install apollo-server-cache-redis
    npm install graphql apollo-server-express
    npm install graphql-upload
    npm install @graphql-tools/load-files
    npm install graphql-subscriptions subscriptions-transport-ws

## Socket.io

- install packages
  npm install socket.io --save
  npm install --save-optional bufferutil utf-8-validate
- Definitions:
  bufferutil: Allows to efficiently perform operations such as masking and unmasking the data payload of the WebSocket frames.
  utf-8-validate: Allows to efficiently check if a message contains valid UTF-8 as required by the spec.

## AWS

aws-sdk: npm install aws-sdk

## SMS

npm install twilio

## Caching

npm install ioredis

## Pre-Deployment

- Ensure .gitignore with node_modules, .env(secrets) on both client and server
- (Recommended)Implement code splitting on react client

## Deployment

- Heroku deploy
  - Limitations:
    - Database: You may need to use cloud mongo
  - Implementation:
    - Direct deployment
    - Using Travis CI
    - Using Circle CI
    - Using Jenkins CI
- Digital Ocean deploy
  (https://www.codecontinue.com/article/deploy-react-node-mern-full-stack-app-to-digital-ocean)[Deployment Documentation]

## Swagger Documentation

- Resources:

  - [API general info](https://swagger.io/docs/specification/api-general-info/)

- http://localhost:<PORT>/api-docs.

## Security issues and best practices

Compromised Database

    - Strongly encrypt passwords with salt and hash (bcrypt)
    - Strongly encrypt password reset tokens (SHA 256)

Brute Force Attacks

    - Use bcrypt to make login requests slow
    - Implement rate limiting(npm install express-rate-limit) which limits the no of requests from on single IP
    - Implement max login attempts

Cross-site Scripting Attacks

    - Store JWT in HTTPOnly cookies
    - Sanitize user input data
    - Set special HTTP headers(helmet)

Cross-site Scripting Attacks - This attack allows the attacker to read the localStorage which is the reason we should never store token in localstorage

    - Store JWT in HTTPOnly cookies
    - Sanitize user input data
    - Set special HTTP headers(helmet)

Sanitization

    - xss-clean
    - express-mongo-sanitize

npm i --save-dev @types/morgan @types/hpp

- -JWT_EXPIRES_IN=90d # 30s | 5m | 5h | 1d
  xss-clean
  create folder '@types'
  Add "../@types" to tsconfig.json's typeRoots attribute along with "../node_modules/@types" if it is not already there
  .d.ts declare module 'xss-clean';

  express-mongo-sanitize
  @types/express-mongo-sanitize

  express-rate-limit
  @types/express-rate-limit

  helmet

  cors
  @types/cors

  compression
  @types/compression

nodemailer

// Put as much business logic in the models to keep the controllers as simple and lean as possible, so that controllers can focus on handling requests and interacting with models and send responses

// Configure Eslint & Prettier: npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-markdown

DATA MODELLING
This is the process of converting unstructured data from real-world scenarios into structured, logical data models

// BUNDLING MVC JS FILES
parcel - npm install --save-dev parcel-bundler
package.json
"scripts": {
...,
"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
},

## Compatibility information

mongoose@5.11.16
node@14.15.5
typescript@4.1.5
