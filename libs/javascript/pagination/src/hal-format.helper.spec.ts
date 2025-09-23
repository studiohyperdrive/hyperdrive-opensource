import {
	calculateNextPage,
	calculatePagination,
	calculateTotalPages,
	createHalLinks,
	HALFormat,
} from './hal-format.helper';

describe('HAL Format Tools', () => {
	const linkToMyAPI = 'http://link-to-my-site.something/api/v1/some-entity';
	const keyOfMyEntity = 'some-entity';
	const myEntities = [{ some: 'thing' }];

	describe('calculateTotalPages', () => {
		it('should calculate the total amount of pages based on the page-size & total amount of items', () => {
			expect(calculateTotalPages(10, 20)).toEqual(2);
		});

		it('should round the result to top', () => {
			expect(calculateTotalPages(10, 1)).toEqual(1);
			expect(calculateTotalPages(100, 703)).toEqual(8);
		});

		it('should cap the number of pages to maxPages if provided', () => {
			expect(calculateTotalPages(10, 100)).toEqual(10);
			expect(calculateTotalPages(10, 100, 5)).toEqual(5);
			expect(calculateTotalPages(10, 20, 1)).toEqual(1);
		});
	});

	describe('calculatePagination', () => {
		it('should return page and count information following the IHALPagination interface', () => {
			expect(calculatePagination(2, 10, 289)).toEqual({
				size: 10,
				totalElements: 289,
				totalPages: 29,
				number: 2,
			});
		});
	});

	describe('calculateNextPage', () => {
		it('should return the currentPage + 1 if there are next pages', () => {
			expect(calculateNextPage(70, 60)).toBe(61);
		});

		it('should return the currentPage if there are no next pages', () => {
			expect(calculateNextPage(70, 70)).toBe(70);
		});

		it('should return 1 if there is only one page', () => {
			expect(calculateNextPage(1, 1)).toBe(1);
		});

		it('should handle invalid input gracefully: currentPage > totalPages', () => {
			expect(calculateNextPage(3, 5)).toBe(3);
		});

		it('should handle 0 as current page', () => {
			expect(calculateNextPage(5, 0)).toBe(1);
		});
	});

	describe('createHalLinks', () => {
		const paginationInfo = calculatePagination(2, 10, 289);

		it('should create a set of links based on the IHALPagination interface', () => {
			expect(createHalLinks(linkToMyAPI, paginationInfo)).toEqual({
				self: {
					href: linkToMyAPI,
				},
				first: {
					href: `${linkToMyAPI}?page=1&pagesize=${paginationInfo.size}`,
				},
				last: {
					href: `${linkToMyAPI}?page=${paginationInfo.totalPages}&pagesize=${paginationInfo.size}`,
				},
				next: {
					href: `${linkToMyAPI}?page=${calculateNextPage(
						paginationInfo.totalPages,
						paginationInfo.number
					)}&pagesize=${paginationInfo.size}`,
				},
			});
		});
	});

	describe('HALFormat', function () {
		it('should create a response conform to the IHALFormat', () => {
			const _page = calculatePagination(1, 10, 1);

			expect(
				HALFormat({
					path: linkToMyAPI,
					key: keyOfMyEntity,
					entities: myEntities,
					page: 1,
					size: 10,
					totalElements: 1,
				})
			).toEqual({
				_links: createHalLinks(linkToMyAPI, _page),
				_embedded: {
					[keyOfMyEntity]: myEntities,
				},
				_page,
			});
		});

		it('should create a response conform to the IHALFormat without links', () => {
			const _page = calculatePagination(1, 10, 1);

			expect(
				HALFormat({
					key: keyOfMyEntity,
					entities: myEntities,
					page: 1,
					size: 10,
					totalElements: 1,
				})
			).toEqual({
				_embedded: {
					[keyOfMyEntity]: myEntities,
				},
				_page,
			});
		});
	});
});
