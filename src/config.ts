require('dotenv').config();
/**
 * Note: try finding these values by crtl + f'ing for them
 * from the source of the https://my-domain.slack.com/customize/emoji page.
 */
export const config = {
	/** the subdomain, eg 'my-domain' in my-domain.slack.com */
	slack_subdomain: process.env.slack_subdomain,
	/** should look something like EJCJTYNVK7 */
	enterprise_id: process.env.enterprise_id,
	/** should start with something like xoxs- */
	api_token: process.env.api_token,
}

let valid = true;
Object.keys(config).forEach(key => {
	if (!(config as any)[key]) {
		console.warn(`Could not load configuration for '${key}'.`);
		valid = false;
	}
});
if (!valid)
	throw new Error('Some configuration variables could not be loaded. Exiting.');