import { EmojiList } from './shapes';
import fs from 'fs';
import { Request } from 'request';
import { time } from './time';
import { SlackCommunicator } from './api';

/** executes iterator over each iteratee asynchronously */
async function asyncForEach<T>(array: T[], callback: (o: T, i: number, arr: T[]) => void) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

/** helper method that creates a file path to save the emoji to */
function getPath(emoji: EmojiList.Emoji) {
	const { name, url } = emoji;
	const parts = url.split(/\.|\//);
	const ext = parts.pop();
	const filename = ext ? [name, ext].join('.') : name;
	return ['images', filename].join('/');
}

/** downloads all emoji specified in the emoji list  */
async function downloadEmojiList(emoji: EmojiList.Emoji[]) {
	await asyncForEach(emoji, async emoji => {
		const { url } = emoji;
		const path = getPath(emoji);
		const req: Request = await SlackCommunicator.downloadEmoji({ url });
		req
			.on('error', err => console.log(err))
			.pipe(fs.createWriteStream(path))
			.on('close', () => { console.log('success') });
	});
}

/** downloads metadata about emoji */
async function fetchEmoji(max: number = Infinity): Promise<EmojiList.Emoji[]> {
	let emoji: EmojiList.Emoji[] = [];
	let page = 0;
	let take = 100;
	let hasMorePages = true;
	while (hasMorePages && page < max) {
		page++;

		const res = await SlackCommunicator.getEmojiList({ page, take });
		const pages = res
			&& res.paging
			&& res.paging.pages;

		if (res.emoji)
			emoji.push(...res.emoji);

		if (!pages)
			hasMorePages = false;
		else
			hasMorePages = page < pages;
	}

	return emoji.map(emoji => ({
		...emoji,
		path: getPath(emoji),
	}));
}

/** saves emoji metadata to file */
async function writeEmoji(emoji: EmojiList.Emoji[]) {
	await fs.writeFile(
		'emoji-list.json',
		JSON.stringify(emoji, null, 2),
		{ encoding: 'utf8' },
		err => err && console.log(err)
	);
}

/** loads emoji metadata from file */
async function loadEmoji(): Promise<EmojiList.Emoji[]> {
	let result: EmojiList.Emoji[] = [];
	const promise = new Promise<EmojiList.Emoji[]>(
		async resolve => await fs.readFile(
			'emoji-list.json',
			{ encoding: 'utf8' },
			(err, data) => {
				if (err)
					throw new Error(err.message);
				if (!data)
					throw new Error('No data found.');
				resolve(JSON.parse(data));
			})
	);
	try {
		result = await promise;
	} catch(e) {
		console.log(e);
	}
	return result;
}

/** posts a new emoji to slack */
async function uploadEmoji(emoji: EmojiList.Emoji) {
	const { path, name } = emoji;

	if (!path)
		throw new Error(`No path specified for emoji '${name}'.`);

	return await SlackCommunicator.uploadEmoji({ path, name });
}

async function main() {
	const dir = './images';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	// download one page of emoji metadata
	const fetchedEmoji = await fetchEmoji(1);

	// write the metadata to file
	await writeEmoji(fetchedEmoji);

	// save those emoji images
	await downloadEmojiList(fetchedEmoji);

	// load the emoji metadata from file
	const emoji = await loadEmoji();

	// grab the first emoji
	const test = emoji[0];

	if (!test)
		throw new Error('Test failed because no emoji exist!');

	// rename it with a unique timestamp
	test.name = 'nanners_' + time.toUnix(time.now());

	// try and uplaod it
	const result = await uploadEmoji(test);

	// log the response
	console.log(result);
}

main();