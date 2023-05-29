[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

<br />
<p align="center">
  <a href="https://github.com/requestNetwork/request-apps">
    <img src="https://raw.githubusercontent.com/RequestNetwork/Request/master/Hubs/Request%20Logos/OnLight/png/Request_onlight_reg_green.png" width="400px" alt="Request Logo" >
  </a>

  <h3 align="center">Request Dapps</h3>

  <p align="center">
    Monorepo containing the Request Network Dapps
    <br />
    <br />
    <a href="https://github.com/requestNetwork/request-apps/packages">Packages</a>
    ·
    <a href="https://github.com/requestNetwork/request-apps/issues">Report Bug</a>
    ·
    <a href="https://github.com/requestNetwork/request-apps/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Build](#build)
- [Run](#run)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started:
**To avoid retyping too much info. Do a search and replace with your text editor for the following:**
`github_username`, `repo_name`, `twitter_handle`, `email`

<!-- GETTING STARTED -->

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
