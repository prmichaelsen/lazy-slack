import request, { Options, Response, Request } from 'request';
import { EmojiList } from './shapes';
import fs from 'fs';
import { config } from './config';

const {
	api_token,
	enterprise_id,
	slack_subdomain,
} = config;

export interface SlackCommunicator {
	/** upload emoji image */
	uploadEmoji: (opts: {
		name: string,
		path: string,
	}) => Promise<any>;
	/** download emoji image */
	downloadEmoji: (opts: {
		url: string,
	}) => Promise<any>;
	/** fetch emoji metadata */
	getEmojiList: (opts: {
		page: number,
		take: number,
	}) => Promise<EmojiList.Response>;
}

/** generate options for getting emoji list metadata */
function getEmojiListOptions(opts: {
	page: number,
	take: number,
}) {
	const { page, take } = opts;
	var options: Options = {
		method: 'POST',
		gzip: true,
		url: `https://${slack_subdomain}.slack.com/api/emoji.adminList`,
		qs:
		{
			_x_id: 'fde80d3b-1552852773.978',
			slack_route: enterprise_id,
			_x_version_ts: '1552688323'
		},
		headers:
		{
			dnt: '1',
			authority: `${slack_subdomain}.slack.com`,
			'cache-control': 'no-cache',
			accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
			'accept-language': 'en-US,en;q=0.9',
			'accept-encoding': 'gzip, deflate, br',
			origin: `https://${slack_subdomain}.slack.com`,
			pragma: 'no-cache'
		},
		form:
		{
			query: '',
			page: String(page),
			count: String(take),
			token: api_token,
			_x_mode: 'online',
		}
	};
	return options;
}

/** generate options for uploading an emoji to slack */
function uploadEmojiOptions(opts: {
	name: string,
	path: string,
}) {
	const { name, path } = opts;
	const options: Options = {
		method: 'POST',
		gzip: true,
		url: `https://${slack_subdomain}.slack.com/api/emoji.add`,
		qs:
		{
			_x_id: 'dcdc618b-1552968136.062',
			_x_csid: 'qpaIBtOZl2E',
			slack_route: enterprise_id,
			_x_version_ts: '1552950872'
		},
		headers:
		{
			dnt: '1',
			authority: `${slack_subdomain}.slack.com`,
			'cache-control': 'no-cache',
			accept: '*/*',
			'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
			'accept-language': 'en-US,en;q=0.9',
			'accept-encoding': 'gzip, deflate, br',
			origin: `https://${slack_subdomain}.slack.com`,
			pragma: 'no-cache'
		},
		formData:
		{
			mode: 'data',
			name,
			image:
			{
				value: fs.createReadStream(path),
				options:
				{
					filename: path,
					contentType: null
				}
			},
			token: api_token,
			_x_mode: 'online'
		}
	};
	return options;
}

/** fetch emoji metadata */
async function getEmojiList(opts: {
	page: number,
	take: number,
}): Promise<EmojiList.Response> {
	return await new Promise((res, rej) => {
		request(getEmojiListOptions(opts), function (error, response, body) {
			if (error) rej(error);
			const json = JSON.parse(body);
			res(json);
		});
	});
}

/** download emoji image */
async function downloadEmoji(opts: {
	url: string,
}): Promise<any> {
	const { url } = opts;
	return await new Promise((res, rej) => {
		request.head(url, (err, response, body) => {
			res(request(url));
		});
	});
}

/** upload emoji image */
async function uploadEmoji(opts: {
	name: string,
	path: string,
}): Promise<any> {

	const options = uploadEmojiOptions(opts);

	return await new Promise((res, rej) => {
		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			res(body);
		});
	});
}

export const SlackCommunicator: SlackCommunicator = {
	getEmojiList,
	downloadEmoji,
	uploadEmoji,
}