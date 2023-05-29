## Contract Management, Invoice and Quotation Modules using Request Network

Quotation, Bidding and Invoicing, voting and token management for contract work undertaken by contractors and road developers from Ministry of Road and Transportation, administrators on Request Network. We are also extending an auction example for enabling sharing of government assets like toll prepaid card, car details information for interstate travel, driving license management and quarterly pollution check and control.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You will need a local version of Node.js installed (version 13+).
You will also need yarn, since we use it to manage the monorepo. ([How to install yarn](https://classic.yarnpkg.com/en/docs/install))

### Installation

1. Clone the repo

```sh
git clone https://github.com/requestNetwork/request-apps.git
```

2. Install dependencies

```sh
yarn install
```

## Build

To build all the packages, run:

```sh
yarn workspaces run build
```

## Run

### Running Create

Go to `packages/create` and run:

```sh
yarn start
```

### Running Pay

Go to `packages/pay` and run:

```sh
yarn start
```

### Request URLs

The Request apps can be accessed through these URLs:

| Product        | Status    | URL                                |
| ---------------| ----------|------------------------------------|
| Request Create |Production |https://create.request.network      |
| Request Create |Staging    |https://baguette-v2.request.network |
| Request Pay    |Production |https://pay.request.network         |
| Request Pay    |Staging    |https://baguette-pay.request.network|

### ETHGasStation API Key

If you get throttled by ethgasstation API, you can add your own API key to `packages/pay/.env` file:

```
REACT_APP_EGS_API_KEY=<YOUR API KEY HERE>
```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/requestNetwork/request-apps.svg?style=flat-square
[contributors-url]: https://github.com/requestNetwork/request-apps/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/requestNetwork/request-apps.svg?style=flat-square
[forks-url]: https://github.com/requestNetwork/request-apps/network/members
[stars-shield]: https://img.shields.io/github/stars/requestNetwork/request-apps.svg?style=flat-square
[stars-url]: https://github.com/requestNetwork/request-apps/stargazers
[issues-shield]: https://img.shields.io/github/issues/requestNetwork/request-apps.svg?style=flat-square
[issues-url]: https://github.com/requestNetwork/request-apps/issues
[license-shield]: https://img.shields.io/github/license/requestNetwork/request-apps.svg?style=flat-square
[license-url]: https://github.com/requestNetwork/request-apps/blob/master/LICENSE

<!-- CONTACT -->

## Contact

The easiest way to reach out to us is through our [Request Discord](https://request.network/discord).
