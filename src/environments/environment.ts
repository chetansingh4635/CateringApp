// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    base_url: 'http://34.210.7.13:9191',
    api_key: 'D9B528D59BCEFC6D5DCC2DB31EA9BEE70FC995CED48BB5318175E1234829D4F4',
    localStorageKeys: {
        API_KEY: 'api_key',
        TOKEN: 'token',
        USER: 'user'
    },
    userType: "Manager",
    offersType: [
        {
            type: '%'
        }, {
            type: 'SAR'
        }, {
            type: 'OFFER'
        }
    ],
    GoogleMapsServicesApiKey: 'AIzaSyBFh9SxnoNauHsOE2WYLtjOfCk6ovfJvc0'
};
