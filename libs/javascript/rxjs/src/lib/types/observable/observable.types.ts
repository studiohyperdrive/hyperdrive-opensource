import { Observable } from 'rxjs';

export type ObservableBoolean = Observable<boolean>;

export type ObservableArray<T> = Observable<T[]>;

export type ObservableString = Observable<string>;

export type ObservableNumber = Observable<number>;

export type ObservableRecord<
	DataType,
	DataId extends string | symbol | number = string,
> = Observable<Record<DataId, DataType>>;

export type BooleanRecord = Record<string, boolean>;
export type ObservableBooleanRecord = Observable<BooleanRecord>;

export type ObservableBlob = Observable<{ fileType: string; blob: Blob }>;

export type ObservableStringRecord<ValueType> = Observable<Record<string, ValueType>>;
