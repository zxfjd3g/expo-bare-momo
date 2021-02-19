export default {
	/* 
	{
    "isNewUser": false,
    "token": "eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSCjAK0A0Ndg1S0lFKrShQsjI0MzSyNDYwNjPWUSotTi3yTAGKGZpAOH6JualAPVUVaVkpxulKtQADFlK_RQAAAA.UWr9QYq7tnJl5Ax6WZMWlAo2j1r6ftTNuZSRE30FYa-UWzFY0e-EiMsQSX0camo7qKBPQ6HesuuoZDGZK1Lq_Q"
  }
	*/
	postLogin: '/user/login',
	getMobileVerificationCode: '/sms/send', // 发送验证码
	postCheckMobileVerificationCode: '/user/register', // 手机验证码注册登录
	postRegisterUserInfo: '/user/auth/registerInfo', // 新用户注册
	postUploadAvatar: '/file/checkIsPortrait', // 上传头像
	postUploadFile: '/file/fileUpload', // 上传文件及图片

	/* 
	{
		"avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
		"imToken": "mkYnrBH07h0cAJSZHdIT6LEZ7X/dvBFQIUTt08skl1g=@pn8y.cn.rongnav.com;pn8y.cn.rongcfg.com",
		"isVip": 0,
		"nickName": "chinavane",
		"sex": "WOMAN",
		"userId": 113,
		"validEndDate": null
	}
	*/
	getLoginUserInfo: '/user/auth/getLoginUserInfo', // 根据token获取用户信息，环信用户信息
	
	/* 
	{
			"isFllow": false,
			"userData": {
					"distance": 1,
					"fansCount": 7,
					"isVip": 0,
					"postCount": 38,
					"userId": 113
			},
			"userInfo": {
					"area": "110102",
					"areainfo": "上海市松江区方塔北路558号",
					"avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
					"birthday": "2000-12-03 00:00:00",
					"city": "110100",
					"createTime": "2020-12-26 12:03:28",
					"height": 170,
					"id": 113,
					"income": "4",
					"industry": "2",
					"introduce": "Who are you I’m chinavane Yes,I can.",
					"isDeleted": 0,
					"marriage": "2",
					"mobile": "13819971001",
					"nickName": "chinavane",
					"param": {
							"areaName": " 西城区",
							"cityName": "市辖区",
							"incomeName": "",
							"industryName": "信息技术",
							"marriageName": "已婚",
							"provinceName": "北京市",
							"sexName": "女"
					},
					"pictures": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/f5176fe3-174d-4ebe-8fb2-74ef3f771235.jpg,https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/shejiao/2020/12/26/7a671b52-58cc-4621-a194-ca8f04b73c6e.jpg",
					"province": "110000",
					"sex": "WOMAN",
					"signature": "I’m chinavane",
					"updateTime": "2020-12-29 21:04:01",
					"userId": 113
			}
	}
	*/
	getUserShow: '/user/auth/show', // 根据token获取个人空间信息，自己平台用户信息，或者其他用户的信息

	/* 
	GET /api/user/auth/home
	用户主页
	 {
    "followCount": 4,
    "friendCount": 1,
    "nickName": "晴天",
    "postCount": 15,
    "fansCount": 2,
    "avatar": "https://shejiao-flie.oss-cn-shanghai.aliyuncs.com/portrait/2020/12/24/df2e4bcd-2feb-4211-8e9e-b00e2911df67.jpg",
    "userId": 1,
    "isVip": 0
  }
	*/
	getHome: '/user/auth/home',
	
	postUpdateUserInfo: '/user/auth/updateUserInfo', // 更新用户信息
	getDictIncome: '/cmn/dict/findByDictCode/Income', // 收入字典
	getDictMarriage: '/cmn/dict/findByDictCode/Marriage', // 婚姻字典
	getDictIndustry: '/cmn/dict/findByDictCode/Industry', // 行业字典
	postJournal: '/circle/post/auth/publish', // 发布日志
	getJournalDetail: '/circle/post/auth/getPostVo', // 朋友圈详情
	getPraise: '/circle/post/auth/praise', // 点赞与取消点赞
	/* 
	GET /api/circle/nearbyPeople/auth/findNearbyPeopleVoPage/{page}/{limit}?range=距离数值&sex=MAN/WOMAN/UNKNOWN
	*/
	getNearPeopleList: '/circle/nearbyPeople/auth/findNearbyPeopleVoPage', // 获取附近的人列表
	/* 
	GET /api/circle/nearbyPeople/auth/findNearbyPostVoPage/{page}/{limit} ?range=距离数值&sex=MAN/WOMAN/UNKNOWN
	*/
	getNearPostList: '/circle/nearbyPeople/auth/findNearbyPostVoPage', // 获取附近的动态列表
	/* 
	POST /api/circle/nearbyPeople/auth/updateLocation
		{
			"latitude": 0,
			"locationName": "string",
			"longitude": 0
		}
	*/
	postUpdateLocation: '/circle/nearbyPeople/auth/updateLocation', // 更新经纬度

	/* 
	GET /api/circle/nearbyPeople/inner/getDistance/{userId}/{toUserId}
	*/
	getDistance: '/circle/nearbyPeople/inner/getDistance', // 获取用户直接的距离

	/* 
	GET /api/circle/post/auth/findAlbumPostPage/{page}/{limit}
	*/
	getMyPostList: '/circle/post/auth/findAlbumPostPage', // 获取用户相册的动态列表

	/* 
	GET /api/circle/post/auth/findFollowPostPage/{page}/{limit}
	*/
	getFollowPostList: '/circle/post/auth/findFollowPostPage', // 获取用户关注的动态列表

	/* 
	GET /api/circle/post/auth/findRecommendPostPage/{page}/{limit}
	*/
  getRecommendPostList: '/circle/post/auth/findRecommendPostPage', // 获取用户推荐的动态列表
	
	
  /* 
  GET /api/user/recommendUser/auth/disLike/{disLikeUserId}
  */
  getDisLike: '/user/recommendUser/auth/disLike', // 用户不喜欢

  /* 
  GET /api/user/recommendUser/auth/findRecommendUserPage/{page}/{limit}
  */
  getRecommendUserList: '/user/recommendUser/auth/findRecommendUserPage', // 获取用户推荐列表

  /* 
  GET /api/user/recommendUser/auth/like/{likeUserId}
  */
  getLike: '/user/recommendUser/auth/like', // 用户喜欢

  /* 
  GET /api/user/recommendUser/auth/likeMy
  */
  getLikeMyList: '/user/recommendUser/auth/likeMy', // 喜欢我的人

  /* 
  GET /api/user/recommendUser/auth/myLike
  */
	getMyLikeList: '/user/recommendUser/auth/myLike', // 我喜欢的用户


	/* 
	GET /api/user/userRelation/auth/cancelFollow/{followUserId}
	取消关注用户
	*/
	getCancelFollow: '/user/userRelation/auth/cancelFollow',

	/* 
	GET /api/user/userRelation/auth/follow/{followUserId}
	关注用户
	*/
	getFollow: '/user/userRelation/auth/follow',

	/* 
	GET /api/user/userRelation/auth/myFans
	我的粉丝
	*/
	getMyFans: '/user/userRelation/auth/myFans',

	/* 
	GET /api/user/userRelation/auth/myFollow
	我关注的用户
	*/
	getMyFollows: '/user/userRelation/auth/myFollow',

	/* 
	GET /api/user/userRelation/auth/myFriend
	我的好友列表
	*/
	getMyFriends: '/user/userRelation/auth/myFriend',

	/* 
	GET /api/user/userRelation/inner/findUserIdList/{userId}
	获取用户id列表，推送用户动态
	*/
	getUserIdList: '/user/userRelation/inner/findUserIdList',

	/* 
	GET /api/user/visitor/auth/findVisitorList
	获取我的来访者列表
	*/
	getVisitorList: '/user/visitor/auth/findVisitorList',

	/* 
	GET /api/user/inner/getUserBaseInfoVo/{userId}
	获取用户基本信息
	*/
	getUser: '/user/inner/getUserBaseInfoVo',

	/* 
	POST /api/user/auth/findUserBaseInfoList
	批量获取用户基本信息
	*/
	getUserList: '/user/auth/findUserBaseInfoList',
	
	// 获取开通会员支付价格列表
	getPriceList: '/order/getPayList',
};

/* 
GET /api/user/auth/getUserInfo
	获取更新用户详细信息

POST /api/user/auth/updatePassword
修改密码

POST /api/user/findPassword
找回密码

POST /api/user/inner/findUserBaseInfoVoList
批量获取用户基本信息

GET /api/user/inner/getUserBaseInfoVo/{userId}
获取用户基本信息

*/