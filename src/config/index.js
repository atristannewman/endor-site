const env = process.env.REACT_APP_ENV;

let server = {
    url: 'http://localhost:4321'
}

let site = {
    url: 'http://localhost:3000'
}

let services = {
    stripe: process.env.REACT_APP_STRIPE_TEST_KEY,
    stytch: process.env.REACT_APP_STYTCH_PUBLIC_TEST_TOKEN
}

switch (env) {
    case 'production':
        server.url = process.env.REACT_APP_PRODUCTION_SERVER_URL
        site.url = process.env.REACT_APP_PRODUCTION_SITE_URL
        services.stripe = process.env.REACT_APP_STRIPE_LIVE_KEY
        services.stytch = process.env.REACT_APP_STYTCH_PUBLIC_LIVE_TOKEN
        break;
    default:
        break;
}


module.exports = { server, services };
