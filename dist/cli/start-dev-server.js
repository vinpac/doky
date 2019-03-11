"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const http_1 = require("http");
const path = require("path");
const handler = require("serve-handler");
const constants_1 = require("./constants");
function startDevServer(config) {
    const headers = [
        {
            source: '**',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'max-age=0',
                },
            ],
        },
    ];
    const server = http_1.createServer((request, response) => {
        return handler(request, response, {
            headers,
            unlisted: ['tmp'],
            public: path.resolve(config.output),
            directoryListing: false,
        }, {
            sendError: () => {
                return handler(request, response, {
                    public: path.resolve(constants_1.BASE_DIR, 'public'),
                    headers,
                    rewrites: [
                        {
                            source: '**',
                            destination: 'index.html',
                        },
                    ],
                    directoryListing: false,
                });
            },
        });
    });
    server.listen(3000, () => {
        console.log('\nDev server running at');
        console.log(`\t${chalk_1.default.cyan('http://localhost:3000')}\n`);
    });
}
exports.default = startDevServer;
//# sourceMappingURL=start-dev-server.js.map