const base_url = 'https://memo.cash';
const urls = 	{
					'posts' : {
						'ranked': '/posts/ranked',
						'top': '/posts/top',
						'personalized': '/posts/personalized',
						'new': '/posts/new',
						'polls': '/polls',
						'threads': '/posts/threads'
					},
					'topics' : {
						'following': '/topics',
						'all': '/topics/all',
						'most-followed': '/topics/most-followed',
						'most-posts': '/topics/most-posts',
					},
				}
const default_prefs =  	{
							'default_posts' : 'ranked',
							'default_topics' : 'all',
							'general' : {
								'show_footer_control': false,
							},
							'font': {
								'url' : '#',
								'name' : '#'	
							}
						}

const default_verified_list =
[
	'1F5GrRezwGokQhxmF4fYaBbbNrPPaeBqMm',	//memo team 			proof: https://twitter.com/memobch/status/992033652765700097 & https://memo.cash/about
// 	'1QCBiyfwdjXDsHghBEr5U2KxUpM2BmmJVt',	//Jason (memo team)		proof: https://memo.cash/about
// 	'13MuoY8fLzES35bNsMveiQR7eR93LtxBmy',	//Eric (memo team)		proof: https://memo.cash/about 
// 	'1HezZbHLhd6fcKs1ytUxDjSF3mcUdHiUeL',	//modulus (memo++)		proof: https://github.com/xmodulus/memoplusplus
// 	'1HLULEeaeygPEXurq6zwFq2DSXNSKUayUa',	//Roger Ver 			proof: https://twitter.com/rogerkver/status/998221922105147398
// 	'1L9D9Zv9BFqTQScFJzz8rXiUjnmnGxRBvk', 	//Craig Wright			proof: https://twitter.com/ProfFaustus/status/989530126407872513
// 	'183xMuyW9BQuTv4uhE9Pki9gZG1xvNFVA',	//BitcoinUnlmited 		proof: https://twitter.com/bitcoinunlimit/status/991530312130707456?s=21 & https://memo.cash/post/46487b9d4966c11084ea7c17e72e2f26f54ba235a823b276d68c25f3d0520ed8
] 

const dark_palette =	[
							'243444',
							'213440',
							'1B2936',
							'71bd2e',
							'7cbd44' 
						]

const api_url = 'https://bitcoincash.blockexplorer.com/api';