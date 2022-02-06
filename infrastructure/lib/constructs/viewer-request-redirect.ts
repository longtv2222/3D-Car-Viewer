//@ts-ignore
// This file should be written in pure javascript and ES5 Compliant only
// @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
function handler(event) {
    var request = event.request;
    console.log(request);
    var host = request.headers.host.value;
    var wwwPrefix = "www.";

    // Since our SPA has static asset, we don't want to redirect these static assets (Cost Extra round trip time)
    if (host.startsWith(wwwPrefix) && (request.uri === '/' || request.uri === '/index.html')) {
        console.log("Redirecting...");
        var response = {
            statusCode: 301,
            statusDescription: 'Redirect To Apex Domain Name',
            headers: {
                'location': { "value": `https://${host.slice(wwwPrefix.length)}${request.uri}` }
            }
        };
        return response;
    }
    return request;
}