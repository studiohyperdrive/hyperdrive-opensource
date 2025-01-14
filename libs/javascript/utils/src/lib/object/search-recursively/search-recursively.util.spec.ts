import { searchRecursively } from './search-recursively.util';

describe('searchRecursively', () => {
	type TestType = {
		id: number;
		children: TestType[];
		something?: string;
	};

	test('searchRecursively', () => {
		let result: TestType | undefined = searchRecursively([], () => true);
		expect(result).toEqual(undefined);

		result = searchRecursively(
			[
				{ id: 1, children: [] },
				{ id: 2, children: [] },
				{ id: 3, children: [] },
				{ id: 4, children: [] },
			],
			() => true
		);
		expect(result).toEqual({ id: 1, children: [] });

		result = searchRecursively(
			[
				{ id: 1, children: [] },
				{ id: 2, children: [] },
				{ id: 3, children: [] },
				{ id: 4, children: [] },
				{ id: 5, children: [] },
			],
			(item) => item.id === 3
		);
		expect(result).toEqual({ id: 3, children: [] });

		result = searchRecursively(
			[
				{
					id: 1,
					children: [
						{ id: 2, children: [] },
						{ id: 3, children: [] },
						{
							id: 4,
							children: [
								{ id: 5, children: [] },
								{ id: 6, children: [] },
								{
									id: 7,
									children: [
										{ id: 8, children: [] },
										{ id: 9, children: [] },
										{ id: 10, children: [] },
									],
								},
							],
						},
						{ id: 11, children: [] },
					],
				},
			],
			(item) => item.id === 6
		);
		expect(result).toEqual({ id: 6, children: [] });

		result = searchRecursively(
			[
				{
					id: 1,
					something: 'blub',
					children: [
						{ id: 2, something: 'random', children: [] },
						{ id: 3, something: 'blubber', children: [] },
						{
							id: 4,
							something: 'oops?',
							children: [
								{ id: 5, something: 'hello blub', children: [] },
								{ id: 6, something: 'bye blub', children: [] },
								{
									id: 7,
									something: 'hello',
									children: [
										{ id: 8, something: 'something', children: [] },
										{ id: 9, something: 'hello and goodbye', children: [] },
										{ id: 10, something: 'yeah, no inspiration', children: [] },
									],
								},
							],
						},
						{ id: 11, something: 'another thing', children: [] },
					],
				},
			],
			(item) => item.something.includes('hello')
		);
		expect(result).toEqual({ id: 5, something: 'hello blub', children: [] });
	});
});
