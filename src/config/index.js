const env = process.env.REACT_APP_ENV;

let server = {
    url: 'http://localhost:4321'
}

let site = {
    url: 'http://localhost:3000'
}

let services = {
    stripe: 'pk_test_51Pb1VEHI6Hv6Cwhbcfezr9r8fZOtgboLoUnDH08dRXKZyudwrS23sCHdTjtIxiqKf5ty6pbtiDjMKYH8Ur0lWyuF004Nr3CxpQ',
    stytch: 'public-token-test-d8143507-586c-46eb-b078-4872d9f99b4e'
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
