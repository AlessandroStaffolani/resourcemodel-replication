# ResourceModel Replication
Distributed system that shows how to replicate resource model through different microservice

### System structure

![alt text](https://github.com/ale8193/resourcemodel-replication/blob/master/system-for-resourcemodel-replication.png "System structure")

### Enviroment

To run this application:

- you need to have a `mongodb` database you will setup db url in configuration files
- you need an `MQTT` broker available for `websocket` on port `1884`, if you need to setup `websocket` follow this link [mqtt enable websocket](https://blog.ithasu.org/2016/05/enabling-and-using-websockets-on-mosquitto/).

### Installation
```
git clone https://github.com/ale8193/resourcemodel-replication.git
```

##### Intallation: node-server
```
cd <resourcemodel-replication-path>/node-server
npm install
```

Than you need to setup config files, they are inside `config` folder of module `node-server` you will found sample file for development and production mode you need to create two files:

- `development.json` adding the content present in `development.json.sample` and replacing with your values
- `production.json` adding the content present in `production.json.sample` and replacing with your values

After all you can start `node-server` in two ways:

- `npm run server` to start in production mode
- `npm run dev` to start in development mode with also nodemon 

NOTE: `node-server` run into the port `5000`

##### Intallation: react-gui
```
cd <resourcemodel-replication-path>/react-gui
npm install
```

As for `node-server` as you need to setup config files, they are inside `config` folder of module `react-gui/src` you will found sample file for development and production mode you need to create two files:

- `development.json` adding the content present in `development.json.sample` and replacing with your values
- `production.json` adding the content present in `production.json.sample` and replacing with your values

After all you can start `react-gui` by running the command:

- `npm run start` to start the client application

NOTE: `react-gui` run into the port `3000`
