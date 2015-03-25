function headlines_wordcloud(hl_words, hl_matches, hl_headlines) {

	var width = d3.select("#wordcloud_div").node().getBoundingClientRect().width;
	var height = d3.select("#wordcloud_div").node().getBoundingClientRect().height;

	var typeFace = 'Overlock';
	var minFontSize = 1.4 + 1.9 * (width - 200)/230;

	colors = d3.scale.category20b();

	var w = d3.select('#wordcloud_div');

	var svg = d3.select('#wordcloud_div').append('svg')
			.attr('id', 'container')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate('+width/2+', '+height/2+')');

	var hl = d3.select('#headlines_div');
	
	function calculateCloud(wordCount) {
		d3.layout.cloud()
			.size([width*1.2, height*1.2])
			.words(wordCount)
			.rotate(function() { return (1-Math.min(1,~~(Math.random() * 5))) * 90;}) // 0 or 90deg //return 0;})// 
			.fontSize(function(d) { return d.size * minFontSize; })
			.on('end', drawCloud)
			.start();
	}

	function drawCloud(words) {
		var vis = svg.selectAll('text').data(words);

		vis.enter().append('text')
			.style('font-size', function(d) { return d.size + 'px'; })
			.style('font-family', typeFace)
			.style('fill', function(d, i) { return colors(i); })
			.attr('text-anchor', 'middle')
			.attr('transform', function(d) { return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';})
			.text(function(d) { return d.text; })
			.on("mouseover", function(d){ d3.select(this).style('fill', '#000'); })
			.on("mouseout", function(d, i){ d3.select(this).style('fill', function() { return colors(i); }); })
			.on("mousedown", function(d, i){
				ids = hl_matches[d.text];
				matching_hl = [];
				for(var k=0; k<ids.length; k++) { matching_hl.push(hl_headlines[ids[k]]);}
				hl.selectAll('p').remove();
				hl.selectAll('p').data(matching_hl).enter().append('p')
					.text(function(d, i2) { return d; })
					.style('color', 'white')
					.transition().style('color', function(d, i){ return colors(~~(Math.random()*100)); });

					$('#headlines_div').animate({ scrollTop:$('#headlines_div').offset().top-1000}, 'fast');
					d3.select('#headline').text(function(){ return 'Headlines with "' + d.text + '"..'; });
			});
	}

	var channel = 'chat';
;

	function getData(){
		calculateCloud(processData(hl_words));
	}

	function processData(strings) { 
		if(!strings) return;

		// convert the array to a long string
		strings = strings.join(' ');
		
		// strip stringified objects and punctuations from the string
		strings = strings.toLowerCase().replace(/object Object/g, '').replace(/[\+\.,\/#!$%\^&\*{}=_`~]/g,'');
		
		// convert the str back in an array 
		strings = strings.split(' '); 

		// Count frequency of word occurance
		var wordCount = {};

		for(var i = 0; i < strings.length; i++) {
		    if(!wordCount[strings[i]])
		        wordCount[strings[i]] = 0;

		    wordCount[strings[i]]++; // {'hi': 12, 'foo': 2 ...}
		}

		//console.log(wordCount);

		var wordCountArr = [];

		for(var prop in wordCount) {
			wordCountArr.push({text: prop, size: wordCount[prop]});
		}
		
		return wordCountArr;
	}

	getData();
	
};
