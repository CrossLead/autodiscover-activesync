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
declare function autodiscover(params: {
    emailAddress: string;
    password: string;
    username?: string;
    queryDns?: boolean;
    debug?: boolean;
}): Promise<string | null>;
export default autodiscover;
