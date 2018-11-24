export namespace EmojiList {
	export interface Emoji {
		name: string;
		is_alias: 0 | 1;
		alias_for: string | null;
		url: string;
		created: number;
		team_id: string;
		user_id: string;
		user_display_name: string;
		avatar_hash: string;
		can_delete: boolean;
		is_bad: boolean;
		synonyms: string[] | null;
		path?: string;
	}
	export interface Response {
		ok?: boolean;
		emoji?: Emoji[];
		disabled_emoji?: any;
		custom_emoji_total_count?: number;
		paging?: {
			count: number;
			total: number;
			page: number;
			pages: number;
		},
	}
}