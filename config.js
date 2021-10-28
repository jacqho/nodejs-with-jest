const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV;

const general = {
    third_parties: {
        google: {
            api: 'https://maps.googleapis.com/maps/api/geocode/json'
        }
    }
}

const prod = {
    app: {
        port: parseInt(process.env.PROD_APP_PORT)
    },
    db: {
        url: process.env.PROD_DB
    },
    third_parties: {
        google: {
            api: general.third_parties.google.api,
            apikey: process.env.PROD_GOOGLE_MAP_APIKEY
        }
    }
};

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 5000
    },
    db: {
        url: process.env.DEV_DB
    },
    third_parties: {
        google: {
            api: general.third_parties.google.api,
            apikey: process.env.DEV_GOOGLE_MAP_APIKEY
        }
    }
};

const test = {
    app: {
        port: parseInt(process.env.TEST_APP_PORT) || 5000
    },
    db: {
        url: process.env.TEST_DB
    },
    third_parties: {
        google: {
            api: general.third_parties.google.api,
            apikey: process.env.TEST_GOOGLE_MAP_APIKEY
        }
    }
};

const config = {
    prod,
    dev,
    test
};

module.exports = config[env];