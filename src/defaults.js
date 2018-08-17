const base_url = 'https://memo.cash';
const urls = {
    'posts': {
        'ranked': '/posts/ranked',
        'top': '/posts/top',
        'personalized': '/posts/personalized',
        'new': '/posts/new',
        'polls': '/polls',
        'threads': '/posts/threads'
    },
    'topics': {
        'following': '/topics',
        'all': '/topics/all',
        'most-followed': '/topics/most-followed',
        'most-posts': '/topics/most-posts',
    },
}
const default_prefs = {
    'default_posts': 'ranked',
    'default_topics': 'all',
    'general': {
        'show_footer_control': true,
    },
    'tags': {
        'enable_hashtags': false,
        'enable_usertags': false,
    },
    'font': {
        'url': '#',
        'name': '#'
    },
    'font_size': {
        'posts' : 25,
        'topics': 16
    }
}

const default_verified_list = [
    '1F5GrRezwGokQhxmF4fYaBbbNrPPaeBqMm', //memo team 			proof: https://twitter.com/memobch/status/992033652765700097 & https://memo.cash/about
    // 	'1QCBiyfwdjXDsHghBEr5U2KxUpM2BmmJVt',	//Jason (memo team)		proof: https://memo.cash/about
    // 	'13MuoY8fLzES35bNsMveiQR7eR93LtxBmy',	//Eric (memo team)		proof: https://memo.cash/about 
    // 	'1HezZbHLhd6fcKs1ytUxDjSF3mcUdHiUeL',	//modulus (memo++)		proof: https://github.com/xmodulus/memoplusplus
    // 	'1HLULEeaeygPEXurq6zwFq2DSXNSKUayUa',	//Roger Ver 			proof: https://twitter.com/rogerkver/status/998221922105147398
    // 	'1L9D9Zv9BFqTQScFJzz8rXiUjnmnGxRBvk', 	//Craig Wright			proof: https://twitter.com/ProfFaustus/status/989530126407872513
    // 	'18Hy2L4xHoWLSsoWwdgKR3eLaBgHGc9Zct',	//BitcoinUnlmited 		proof: https://twitter.com/bitcoinunlimit/status/991530312130707456
    //  '13tPfrbpbMTdng7fgV7bsVPhFrfgTVyszG',   //Gavin Andresen        proof: https://twitter.com/gavinandresen/status/990281861938270208 AND https://twitter.com/gavinandresen/status/990280065731743749
    //  '1CCEaBCXdnPpycdpodXu5F8xLrZtwpnhmX',   //CoinText              proof: https://twitter.com/CoinText/status/1000447604193280001
    //  '1G2qwNU7rr8pQLpGkztv2zGnhBrX9EEpaf',   //eatBCH                proof: https://twitter.com/eatBCH/status/989974947102642176
    //  '1KNaY7dD9eVvUw6KyTZfVdVSh55cuhBKhE',   //cgcardona             proof: https://twitter.com/cgcardona/status/985590455948603392
    //  '1EDtyAxn8zh9qBdWxdCyhY7AFzLcHvFrtE',   //freetrader            proof: https://ftrader.github.io/posts/misc/welcome.html
    //  '1P8iGT3bhPDPQfDEC1aRk3JCwKG1Naiw4G',   //r0bbot                proof: https://twitter.com/r0bbot/status/1004171361453998081   
    
    //  '183xMuyW9BQuTv4uhE9Pki9gZG1xvNFVA',    //Peter Tschipper       proof: ???
    //  '17R9gr4GUfqVwLriAomJ5RqmTJievnQQ5Z',   //Ryan X. Charles       proof: ???
    //  '1JaGzuXnxvRaSuyrrduF4gsn4shfRvHCGn',   //Checksum0             proof: ???
    //  '1L8jrKEciyijzYr94FkxWv9w6PDJEUFDRV',   //Imaginary username    proof: ???
    //  '1BNBPUBjBQ9W8Bmqn4P6smN6PcqVu2rwPV',   //zquestz               proof: ???
    //  '15VpdK8JTnTXBye25FugQiU2f3VYx1nZTG',   //falkvinge             proof: ???
    //  '16SzYapUsGQqTzVzJRpCuWn2A1m8oxjFZF',   //Tom Zander            proof: ???
]

const dark_palette = [
    '243444',
    '213440',
    '1B2936',
    '71bd2e',
    '7cbd44'
]

const api_url = 'https://bitcoincash.blockexplorer.com/api';