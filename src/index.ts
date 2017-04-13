import * as request from 'request-promise';
import * as denodeify from 'denodeify';
import * as dns from 'dns';
import {
  parseString as parseStringCb,
  convertableToString,
  OptionsV2
} from 'xml2js';


type ParseStringDenodeified = (
  str: convertableToString,
  opts?: OptionsV2
) => Promise<any>;

type DNSResolveDenodeified = (
  domain: string,
  rtype?: string
) => Promise<string[]>;


const dnsResolve: DNSResolveDenodeified = denodeify(dns.resolve);
const parseString: ParseStringDenodeified = denodeify(parseStringCb);

/**
 * Removes the potential prefix of a string and makes the first character
 * lower case to make it easier to work with.
 *
 * @param {String} string
 * @returns {String}
 */
function removePrefix(s: string) {
  const splitString = s.split(':');
  const withoutPrefix = splitString[1] || splitString[0];
  return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
}

function xmlToJson(xmlString: string) {
  return parseString(xmlString, {
    tagNameProcessors: [removePrefix],
    attrNameProcessors: [removePrefix],
    explicitArray: false,
    mergeAttrs: true
  });
}

function parseAutodiscoverResponse(json: any): string {
  // TODO: use lodash _.get()?
  return json &&
    json.autodiscover &&
    json.autodiscover.response &&
    json.autodiscover.response.action &&
    json.autodiscover.response.action.settings &&
    json.autodiscover.response.action.settings.server &&
    json.autodiscover.response.action.settings.server.url;
}

async function queryDns(domain: string, debug: boolean) {
  try {
    const response: any[] = await dnsResolve(`_autodiscover._tcp.${  domain }`, 'SRV');
    const names = response.map((e: any) => e.name);

    if (debug) {
      console.log('queryDns, names', names);
    }

    return names;
  } catch ( err ) {
    return [];
  }
}

async function getResponse(
  url: string,
  username: string,
  password: string,
  requestBody: string,
  debug: boolean
) {
  const response = await request({
    uri: url,
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8'
    },
    auth: {
      user: username,
      pass: password
    },
    body: requestBody,
    followRedirect: false,
    resolveWithFullResponse: true
  }).catch( (err: any) => {
    if (debug) {
      console.log('Error in response', err);
    }

    return null;
  });

  if (!response) {
    if (debug) {
      console.log('NO RESPONSE for URL', url);
    }

    return null;
  }

  const body = response.body;
  const json = await xmlToJson(body);

  if (debug) {
    // console.log('RESPONSE', response);
    console.log(JSON.stringify(json, null, 2));
  }

  if (!json.autodiscover.response.error) {
    if (debug) {
      console.log('GOOD',  url);
    }

    return json;
  }

  if (debug) {
    console.log('NO GOOD', url);
  }

  return null;
}


function createAutodiscoverXml(emailAddress: string) {
  // Exchange XML parsing doesn't trim spaces: http://stackoverflow.com/questions/41825653/errors-during-autodiscover-procedure-on-microsoft-exchange-2016#comment70878946_41825653
  return `
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/mobilesync/requestschema/2006">
  <Request>
    <EMailAddress>${ emailAddress }</EMailAddress>
    <AcceptableResponseSchema>http://schemas.microsoft.com/exchange/autodiscover/mobilesync/responseschema/2006</AcceptableResponseSchema>
  </Request>
</Autodiscover>`;
}

/**
 * Tries differently possible autodiscover urls.
 *
 * https://msdn.microsoft.com/en-us/library/office/jj900169(v=exchg.150).aspx
 * https://msdn.microsoft.com/en-us/library/office/hh352638(v=exchg.140).aspx
 *
 * @param {String[]} domains
 * @param {String} emailAddress
 * @param {String} password
 * @param {String} username
 * @param {Boolean} debug
 *
 */
async function autodiscoverDomains(
  domains: string[],
  emailAddress: string,
  password: string,
  username: string,
  debug: boolean
) {
  const requestBody = createAutodiscoverXml(emailAddress);

  if (debug) {
    console.log('Request XML', requestBody);
  }

  let autodiscoverUrl;
  for (const domain of domains) {
    let json: any = await getResponse(`https://${ domain }/autodiscover/autodiscover.xml`, username, password, requestBody, debug);

    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
      return autodiscoverUrl;
    }

    json = await getResponse(`https://autodiscover.${ domain }/autodiscover/autodiscover.xml`, username, password, requestBody, debug);

    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
      return autodiscoverUrl;
    }

    // HTTP redirect method
    const redirectUri = `http://autodiscover.${ domain }/autodiscover/autodiscover.xml`;
    const response = await request({
      uri: redirectUri,
      method: 'GET',
      followRedirect: false,
      simple: false,
      resolveWithFullResponse: true
    });

    if (response.statusCode !== 302) {
      throw new Error(`Redirect method: ${redirectUri} did not return status 302`);
    }

    if (!response.headers.location) {
      throw new Error(`Redirect method: ${redirectUri} did not include Location header`);
    }

    json = await getResponse(response.headers.location, username, password, requestBody, debug);

    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
      return autodiscoverUrl;
    }
  }

  return null;
}

/**
 * Tries to find the url of the Active Sync Server.
 *
 * @param {Object} params
 * @param {String} [params.emailAddress]
 * @param {String} [params.password]
 * @param {String} [params.username]
 * @param {Boolean} [params.queryDns]
 * @param {Boolean} [params.debug]
 */
async function autodiscover(params: {
  emailAddress: string;
  password: string;
  username?: string;
  queryDns?: boolean;
  debug?: boolean;
}) {
  const {
    emailAddress,
    password,
    username = params.emailAddress,
    queryDns: query = true,
    debug = false
  } = params;

  const domain: string = emailAddress.substr(emailAddress.indexOf('@') + 1);

  let domains: string[] = [domain];

  if (query) {
    domains = domains.concat(...await queryDns(domain, debug) as string[]);
  }

  return await autodiscoverDomains(domains, emailAddress, password, username, debug);
};

export default autodiscover;