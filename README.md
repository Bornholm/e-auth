# E-Auth

OpenID Provider for PCLL services

**/!\ Warning /!\** Work in progress ! Not ready for production yet

## Dependencies

- [NodeJS](https://nodejs.org/en/download/) v~6.10
- [MongoDB](https://www.mongodb.com/download-center?jmp=nav) v~3.4

## Development

### Getting started

#### With Docker-Compose

```bash
cd e-auth
npm install
./scripts/dump-assets
docker-compose up
# Then open your browser to http://localhost:3000
# See docker-compose.yml and containers/*/Dockerfile for more details
```

#### Without Docker-Compose

1. Install and start your MongoDB instance
2. Create a `.e-authrc` configuration file in the project directory (see `config.js` and [rc module documentation](https://www.npmjs.com/package/rc) )
3. In your terminal

  ```bash
  npm install
  ./scripts/dump-assets
  npm start
  ```

## FAQ

### How to open MongoDB administration console with Docker-Compose ?

After running `docker-compose up`, in another terminal:

```bash
docker-compose exec db mongo
```

### How to load/overwrite provider's authorized clients ?

```bash
docker-compose exec provider sh
./script/load-clients /path/to/clients.js # See examples/clients-example.js
```

## Licence

[CeCILL v2.1](http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.txt)
