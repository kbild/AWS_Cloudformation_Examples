// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
let environment = process.env.environment;
let account;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context, callback) => {
    try {
        // const ret = await axios(url);
        account = JSON.stringify(context.invokedFunctionArn.split(':')[4]);
          const html = `
          <html>
            <style>
              h1 { color: #0074D9; }
              p { color: #0074D9; }
              b { color: #FF4136; }
              a { color: #FF4136; }
              body { background-color: #DDDDDD; }
            </style>
            <body>
              <h1>CI/CD example for multiple accounts</h1>
              <p>hello world from environment <b> ${environment} </b> in account <b> ${account} </b></p>
              </br>
              <p>Example app, more details on <a href="https://kbild.ch/blog/2020-5-4-cf_multiple_accounts_regions/" target="_blank">kbild's Blog</a></p>
            </body>
          </html>`;
        response = {
            'statusCode': 200,
        headers: {
            'Content-Type': 'text/html',
        },
            'body': html,
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    callback(null, response);
};
