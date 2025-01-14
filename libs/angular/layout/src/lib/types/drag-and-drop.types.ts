type NgxAccessibleDragAndDropFromToMessage =
	| `${string}{{#item}}${string}{{#to}}${string}{{#from}}${string}`
	| `${string}{{#item}}${string}{{#from}}${string}{{#to}}${string}`
	| `${string}{{#to}}${string}{{#item}}${string}{{#from}}${string}`
	| `${string}{{#to}}${string}{{#from}}${string}{{#item}}${string}`
	| `${string}{{#from}}${string}{{#item}}${string}{{#to}}${string}`
	| `${string}{{#from}}${string}{{#to}}${string}{{#item}}${string}`;

export interface NgxAccessibleDragAndDropMessageRecord {
	selected: `${string}{{#item}}${string}`;
	deselected: `${string}{{#item}}${string}`;
	reordered: NgxAccessibleDragAndDropFromToMessage;
	moved: NgxAccessibleDragAndDropFromToMessage;
	cancelled: `${string}{{#item}}${string}`;
	item: string;
	container: string;
	description: string;
}

export type NgxAccessibleDragAndDropMoveType = 'reordered' | 'moved';

interface NgxAccessibleDragAndDropBaseMessage<
	KeyType extends keyof NgxAccessibleDragAndDropMessageRecord,
	DataType,
> {
	type: KeyType;
	data: DataType;
}

export type NgxAccessibleDragAndDropMessage =
	| NgxAccessibleDragAndDropBaseMessage<
			'selected' | 'deselected' | 'cancelled',
			{ item: string; itemLabel?: string }
	  >
	| NgxAccessibleDragAndDropBaseMessage<
			'reordered' | 'moved',
			{
				item: string;
				from: string;
				to: string;
				itemLabel?: string;
				toLabel?: string;
				fromLabel?: string;
			}
	  >;

export interface NgxAccessibleDragAndDropMoveEvent {
	previousIndex: number;
	newIndex: number;
	previousContainer: number;
	newContainer: number;
}
