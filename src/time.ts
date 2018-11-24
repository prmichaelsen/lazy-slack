import * as Moment from 'moment';
import { isNumber, isString } from 'util';
import moment = require('moment');

/** a valid ISO time string */
export interface IsoString {
	toString(): string;
}
/**
 * A wrapper for moment that enforces how it is used.
 * Times should only ever be ISO string representations of dates.
 * All saved dates should be processed through this class.
 */
export interface Time {
	/** returns now */
	now(): IsoString;
	/** parses time and returns time */
	parse(time: string): IsoString;
	/** checks if valid time */
	isValid(time: any): time is IsoString;
	/** formats the date as a string */
	format(time: IsoString): string;
	/** adds some time to the ITimeString, duration may be negative */
	add(time: IsoString, duration: Moment.MomentInputObject): IsoString;
	/** returns a ITimeString from a unix timestamp */
	fromUnix(ms: number): IsoString;
	/** returns a unix timestamp from an ITimeString */
	toUnix(time: IsoString): number;
	/** checks if time a is before time b */
	isBefore(a: IsoString, b: IsoString): boolean;
	/** checks if time a is same or before time b */
	isSameOrBefore(a: IsoString, b: IsoString): boolean;
	/** checks if time a is after time b */
	isAfter(a: IsoString, b: IsoString): boolean;
	/** checks if time a is same or after time b */
	isSameOrAfter(a: IsoString, b: IsoString): boolean;
	/**
	 * returns a moment for manipulation. Try to avoid using this,
	 * if you can.
	 */
	toMomentDangerously(time: IsoString): moment.Moment;
	/**
	 * parses time and returns time or undefined.
	 * Beware that this function is very forgiving, and
	 * may successfully parse things that do not
	 * actually represent a time.
	 * @param format see Moment.js docs
	 */
	parseDangerously(time: string, format?: string): IsoString | undefined;
}

export const time: Time = {
	now() {
		return moment().toISOString();
	},
	parse(time) {
		const date = moment(time, moment.ISO_8601);
		if (date.isValid()) {
			return date.toISOString();
		} else {
			throw new Error('time was not a valid ISO_8601 string!');
		}
	},
	parseDangerously(time, format) {
		let date;
		if (format) {
			date = moment(time, format);
		} else {
			date = moment(time);
		}
		if (date.isValid()) {
			return date.toISOString();
		} else {
			return undefined;
		}
	},
	isValid(time: any): time is IsoString {
		if (!isString(time)) {
			return false;
		}
		return moment(time, moment.ISO_8601).isValid();
	},
	isBefore(a, b) {
		if (!isNumber(a)) {
			a = this.toUnix(a);
		}
		if (!isNumber(b)) {
			b = this.toUnix(b);
		}
		return a < b;
	},
	isSameOrBefore(a, b) {
		if (!isNumber(a)) {
			a = this.toUnix(a);
		}
		if (!isNumber(b)) {
			b = this.toUnix(b);
		}
		return a < b || a === b;
	},
	isAfter(a, b) {
		if (!isNumber(a)) {
			a = this.toUnix(a);
		}
		if (!isNumber(b)) {
			b = this.toUnix(b);
		}
		return a > b;
	},
	isSameOrAfter(a, b) {
		if (!isNumber(a)) {
			a = this.toUnix(a);
		}
		if (!isNumber(b)) {
			b = this.toUnix(b);
		}
		return a > b || a === b;
	},
	format(time) {
		return moment(time.toString()).format();
	},
	add(time, duration) {
		return moment(time.toString(), moment.ISO_8601).add(duration);
	},
	fromUnix(ms: number): IsoString {
		const date = moment.unix(ms);
		if (date.isValid()) {
			return date.toISOString();
		} else {
			throw new Error('time was not a valid unix timestamp!');
		}
	},
	toUnix(time): number {
		return moment(time.toString()).unix();
	},
	toMomentDangerously(time: IsoString) {
		return moment(time.toString(), moment.ISO_8601);
	},
};
