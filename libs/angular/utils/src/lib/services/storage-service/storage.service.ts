import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, Subject } from 'rxjs';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import {
	NgxStorage,
	NgxStorageClearEvent,
	NgxStorageEvent,
	NgxStorageRecord,
	NgxStorageRemoveEvent,
	NgxStorageSetEvent,
	NgxStorageType,
} from '../../types';

/**
 * A service that provides a SSR-proof Observable based approach to the session- and localStorage.
 */
@Injectable({ providedIn: 'root' })
export class NgxStorageService {
	private readonly windowService = inject(NgxWindowService);

	/**
	 * A record to hold the properties in the sessionStorage
	 */
	private readonly sessionStorageRecord: NgxStorageRecord = {};
	/**
	 * A record to hold the properties in the localStorage
	 */
	private readonly localStorageRecord: NgxStorageRecord = {};
	/**
	 * A subject to hold the events of the storage
	 */
	private readonly storageEventSubject: Subject<NgxStorageEvent> = new Subject();

	/**
	 * An observable that emits whenever the session- or the localStorage was updated
	 */
	public readonly storageEvents$: Observable<NgxStorageEvent> =
		this.storageEventSubject.asObservable();

	constructor() {
		const windowService = this.windowService;

		// Iben: Get the initial values of the session and the local storage
		windowService.runInBrowser(() => {
			this.setupStorage(sessionStorage, this.sessionStorageRecord);
			this.setupStorage(localStorage, this.localStorageRecord);
		});
	}

	/**
	 * A localStorage implementation using observables
	 */
	public get localStorage(): NgxStorage {
		return {
			getItem: <DataType = any>(key: string) => this.getItem<DataType>(key, localStorage),
			getItemObservable: <DataType = any>(key: string) =>
				this.getItemObservable<DataType>(key, this.localStorageRecord),
			removeItem: (key: string) =>
				this.removeItem(key, localStorage, this.localStorageRecord, 'local'),
			setItem: <DataType = any>(key: string, item: DataType) =>
				this.setItem(key, item, localStorage, this.localStorageRecord, 'local'),
			clear: () => this.clearStorage(localStorage, this.localStorageRecord, 'local'),
		};
	}

	/**
	 * A sessionStorage implementation using observables
	 */
	public get sessionStorage(): NgxStorage {
		return {
			getItem: <DataType = any>(key: string) => this.getItem<DataType>(key, sessionStorage),
			getItemObservable: <DataType = any>(key: string) =>
				this.getItemObservable<DataType>(key, this.sessionStorageRecord),
			removeItem: (key: string) =>
				this.removeItem(key, sessionStorage, this.sessionStorageRecord, 'session'),
			setItem: <DataType = any>(key: string, item: DataType) =>
				this.setItem(key, item, sessionStorage, this.sessionStorageRecord, 'session'),
			clear: () => this.clearStorage(sessionStorage, this.sessionStorageRecord, 'session'),
		};
	}

	private getItem<DataType = any>(key: string, storage: Storage): DataType {
		return this.parseValue(storage.getItem(key));
	}

	/**
	 * Returns an observable version of the storage value
	 *
	 * @param key - The key of the storage value
	 * @param record  - The storage record
	 */
	private getItemObservable<DataType>(
		key: string,
		record: NgxStorageRecord
	): Observable<DataType> {
		// Iben: Return NEVER when not in browser
		if (!this.windowService.isBrowser()) {
			return NEVER;
		}

		// Iben: If the subject already exists, we return the observable
		if (record[key]) {
			return record[key].asObservable();
		}

		// Iben: If no subject exits, we create a new one
		record[key] = new BehaviorSubject<DataType>(undefined);

		// Iben: Return the observable
		return this.getItemObservable<DataType>(key, record);
	}

	/**
	 * Sets an item in the storage
	 *
	 * @param key - The key of the item
	 * @param item - The item in the storage
	 * @param storage - The storage in which we want to save the item
	 * @param record - The corresponding storage record
	 */
	private setItem<DataType = any>(
		key: string,
		item: DataType,
		storage: Storage,
		record: NgxStorageRecord,
		type: NgxStorageType
	): NgxStorageSetEvent | undefined {
		// Iben: Early exit when we're in the browser
		if (!this.windowService.isBrowser()) {
			return undefined;
		}

		// Iben: Check if there's already a subject for this item. If not, we create one
		let subject = record[key];

		if (!subject) {
			subject = new BehaviorSubject<DataType>(undefined);
			storage[key] = subject;
		}

		// Iben: Store the current value of the subject
		const oldValue = subject.getValue();

		// Iben: Set the item in the storage
		storage.setItem(key, typeof item === 'string' ? item : JSON.stringify(item));

		// Iben: Update the subject in the record
		subject.next(item);

		// Iben: Create the storage event
		const event: NgxStorageSetEvent = {
			key,
			newValue: item,
			oldValue,
			storage: type,
			type: 'set',
		};

		// Iben: Emit the storage event
		this.storageEventSubject.next(event);

		// Iben: Return the storage event
		return event;
	}

	/**
	 * Remove an item from the storage and emit a remove event
	 *
	 * @param  key - The key of the item
	 * @param storage - The storage we wish to remove the item from
	 * @param record - The record with the subject
	 * @param type - The type of storage
	 */
	private removeItem(
		key: string,
		storage: Storage,
		record: NgxStorageRecord,
		type: NgxStorageType
	): NgxStorageRemoveEvent | undefined {
		// Iben: Early exit when we're not in the browser
		if (!this.windowService.isBrowser()) {
			return undefined;
		}

		// Iben: Get the old item
		const oldValue = this.parseValue(storage.getItem(key));

		// Iben: Remove the item from the storage
		storage.removeItem(key);

		// Iben Update the subject if it exists
		record[key]?.next(undefined);

		// Iben: Create the event and return and emit it
		const event: NgxStorageRemoveEvent = {
			oldValue,
			storage: type,
			key,
			type: 'remove',
		};

		this.storageEventSubject.next(event);
		return event;
	}

	/**
	 * Clears the storage, completes all subjects and emits a clear event
	 *
	 * @param storage - The storage we wish to clear
	 * @param record - The record with the subjects
	 * @param type - The type of storage
	 */
	private clearStorage(
		storage: Storage,
		record: NgxStorageRecord,
		type: NgxStorageType
	): NgxStorageClearEvent | undefined {
		// Iben: Early exit when we're not in the browser
		if (!this.windowService.isBrowser()) {
			return undefined;
		}

		// Iben: Clear the storage
		storage.clear();

		// Iben: Clear the record and complete all subjects
		Object.entries(record).forEach(([key, subject]) => {
			subject.next(undefined);
			subject.complete();

			record[key] = undefined;
		});

		// Iben: Create and emit event
		const event: NgxStorageClearEvent = {
			type: 'clear',
			storage: type,
		};

		this.storageEventSubject.next(event);

		return event;
	}

	/**
	 * Grabs the existing storage and updates the record
	 *
	 * @private
	 * @param {Storage} storage - The current state of the storage
	 * @param {NgxStorageRecord} record
	 * @memberof NgxStorageService
	 */
	private setupStorage(storage: Storage, record: NgxStorageRecord) {
		Object.entries(storage).forEach(([key, value]) => {
			record[key] = new BehaviorSubject(this.parseValue(value));
		});
	}

	/**
	 * Parses a string value from the storage to an actual value
	 *
	 * @param value - The provided string value
	 */
	private parseValue(value: string): any {
		// Iben: If the value does not exist, return the value
		if (!value) {
			return value;
		}

		// Iben: If the value is either true or false, return a boolean version of the value
		if (value === 'true' || value === 'false') {
			return value === 'true';
		}

		// Iben: If the value is a number, return the parsed number
		if (value.match(/^[0-9]*[,.]{0,1}[0-9]*$/)) {
			return Number(value);
		}

		// Iben: If the value is an object, return the parsed object
		if (value.match(/{(.*:.*[,]{0,1})*}/)) {
			return JSON.parse(value);
		}

		// Iben: Return the string value as is
		return value;
	}
}
