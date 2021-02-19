export const PeopleListData = {
	totalDocs: 100,
	limit: 10,
	page: 1,
	totalPages: 10,
	hasNextPage: true,
	nextPage: 2,
	hasPrevPage: false,
	prevPage: null,
	docs: [
		{
			id: 1,
			userMsg: {
				userName: '爱在冬天',
				avatar: 'http://192.168.155.3:5000/004.jpg',
				age: 19,
				level: 'SVIP5',
				sex: 'WOMAN',
				brief: '我是菜，但我不会永远菜下去',
			},
			journalMessage: {
				content: '冬天的早晨适合健身~~',
				images: ['girl010.jpg', 'girl011.jpg', 'girl012.jpg'],
			},
			message: { distance: '0.7km' },
		},
		{
			id: 2,
			userMsg: {
				userName: '快来看太阳',
				avatar: 'http://192.168.155.3:5000/005.jpg',
				age: 23,
				level: 'SVIP6',
				sex: 'MAN',
			},
			message: { distance: '2.1km', networkStatus: '在线' },
			journalMessage: {
				images: [],
			},
		},
		{
			id: 3,
			userMsg: {
				userName: '春天就要到了',
				avatar: 'http://192.168.155.3:5000/006.jpg',
				age: 24,
				sex: 'WOMAN',
			},
			message: { distance: '2.4km', networkStatus: '离线' },
			journalMessage: {
				images: [],
			},
		},
	],
};
