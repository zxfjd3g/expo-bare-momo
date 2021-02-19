export const JournalListData = {
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
				avatar: 'http://192.168.155.3:5000/002.jpg',
				age: 19,
				level: 'SVIP5',
				sex: 'WOMAN',
				brief: '我是菜，但我不会永远菜下去',
			},
			journalMessage: {
				content: '冬天的早晨适合健身~~',
				images: [
					'http://192.168.155.3:5000/girl001.jpg',
					'http://192.168.155.3:5000/girl002.jpg',
					'http://192.168.155.3:5000/girl003.jpg',
					'http://192.168.155.3:5000/girl004.jpg',
					'http://192.168.155.3:5000/girl005.jpg',
					'http://192.168.155.3:5000/girl006.jpg',
					'http://192.168.155.3:5000/girl007.jpg',
					'http://192.168.155.3:5000/girl008.jpg',
					'http://192.168.155.3:5000/girl009.jpg',
				],
			},
			timeAndLocation: { time: '1小时前发布', location: '上海' },
			operate: { like: 113, comment: 52 },
		},
		{
			id: 2,
			userMsg: {
				userName: '快来看太阳',
				avatar: 'http://192.168.155.3:5000/001.jpg',
				age: 23,
				level: 'SVIP6',
				sex: 'MAN',
			},
			journalMessage: {
				content:
					'React Native 在布局和样式上极大程度上借鉴了 Web 前端所使用的 CSS 规格。CSS 布局方面的算法主要由三个部分组成，首先是解决单个 UI 元素的尺寸问题的 Box 模型（具体由 width，height，padding，border，margin 属性构成），其次是解决 UI 元素相对位置的 Position 模型（具体由 position，top，right，bottom，left 属性构成），最后是解决剩余空间分配问题的 Flexbox 模型。',
				images: ['http://192.168.155.3:5000/girl010.jpg'],
			},
			timeAndLocation: { time: '3分钟前发布', location: '北京' },
			operate: { like: 14, comment: 152 },
		},
		{
			id: 3,
			userMsg: {
				userName: '春天就要到了',
				avatar: 'http://192.168.155.3:5000/003.jpg',
				age: 24,
				sex: 'WOMAN',
			},
			journalMessage: {
				content: '12月12日，四川成都郫都区一封闭小区，一女子不听劝阻强行翻越隔离墙。',
				images: ['http://192.168.155.3:5000/girl011.jpg', 'http://192.168.155.3:5000/girl012.jpg'],
			},
			timeAndLocation: { time: '3分钟前发布', location: '深圳' },
			operate: { like: 1114, comment: 233 },
		},
	],
};
