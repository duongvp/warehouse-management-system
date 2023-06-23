﻿# warehouse-management-system
### Installation
Clone the repo
```
git clone https://github.com/duongvp/warehouse-management-system.git
```

Change to the `wms` folder and install development and production dependencies.

```
cd wms
npm install
```

Change to the `client` folder and install development and producation dependencies.
```
cd client
npm install
```

You will need to set up MongoDB. See [MongoDB](https://docs.mongodb.com/) for instructions
and setup a .env file and add.
MONGODB_URI=YOUR MONGODB DATA
```

Go to the `wms` folder and start the server.
```
cd wms
npm run dev

Open in your browser and navigate to http://localhost:3000. You access the back-end on http://localhost:5000.
