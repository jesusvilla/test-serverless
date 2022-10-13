# Test Serverless
## Technical test - Backend Javascript

It's a technical test for Backend profile in Culqi

## Features

- Blazing fast api
- Minimal dependencies (ajv for schema validations, redis)
- 100% TypeScript
- NaturalRouter rewritten for higher performance on AWS Lambda


## Proof

The test consists of creating 2 apis:

1. The first api allows to tokenize credit card information.
2. The second api returns the information stored from the token generated in api 1


# Technologies

1. AWS Lambda
2. AWS ApiGateway
3. AWS ElastiCache for Redis
4. Serverless Framework with TypeScript
5. Jest: Work in Progress...


## Installation

Requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.
```sh
npm i
```

Start the server in a development environment:
```sh
npm start
```

Listen app in: ``http://localhost:3000``


## Commands


| Command | Description |
| ------ | ------ |
| ``npm start`` | Start the server in a development environment |
| ``npm run deploy`` | Deploy the repository to the cloud  |
| ``npm run test`` | Run the unit tests |
| ``npm run lint`` | Check for existing errors using eslint |


## License

MIT

**Made with Love for Culqi**
