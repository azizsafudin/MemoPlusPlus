const base_url = 'https://memo.cash';
const urls = 	{
					'posts' : {
						'ranked': '/posts/ranked',
						'top': '/posts/top',
						'personalized': '/posts/personalized',
						'new': '/posts/new'
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
						}

const default_verified_list =
[
	'1F5GrRezwGokQhxmF4fYaBbbNrPPaeBqMm',	//memo team 			proof: https://twitter.com/memobch/status/992033652765700097 & https://memo.cash/about
	// '1QCBiyfwdjXDsHghBEr5U2KxUpM2BmmJVt',	//Jason (memo team)		proof: https://memo.cash/about
	// '13MuoY8fLzES35bNsMveiQR7eR93LtxBmy',	//Eric (memo team)		proof: https://memo.cash/about 
	// '1HezZbHLhd6fcKs1ytUxDjSF3mcUdHiUeL',	//modulus (memo++)		proof: https://github.com/xmodulus/memoplusplus
	// '1HLULEeaeygPEXurq6zwFq2DSXNSKUayUa',	//Roger Ver 			proof: https://twitter.com/rogerkver/status/998221922105147398
] 