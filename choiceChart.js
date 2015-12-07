var margin = {top: 10, right: 25, bottom: 70, left: 65}, timewidth = 250, timeheight = 400;

var x = d3.time.scale()
					.range([0, timewidth]);

var y = d3.scale.linear()
					.range([timeheight, 0]);

var xAxis = d3.svg.axis()
							.scale(x)
							.ticks(5)
							.tickFormat(d3.time.format("%Y"));
							

var yAxis = d3.svg.axis()
							.scale(y)
							.orient("left");		//evtl. tickFormat für Achsensplit????

var svg = d3.select("#choiceChart").append("svg")
		  .attr("width", timewidth + margin.left + margin.right)
		  .attr("height", timeheight + margin.top + margin.bottom)
		.append("g")
		  .attr("transform", "translate(50,30)");		

var parseDate = d3.time.format("%Y-%m-%d").parse;
var year = d3.time.format("%Y-%m");

d3.tsv("diffstats", function(d) {
	return {version2: year(parseDate(d.version2)),
	};

}, function(error, rows) {
	rows.sort(function(a, b) {
                return d3.ascending(a.version2, b.version2);
        });	
	
	var counts = {};
	rows.forEach(function(r) {
    if (!counts[r.version2]) {
        counts[r.version2] = 0;
    }
    counts[r.version2]++;
	});
	
	var data = [];
	Object.keys(counts).forEach(function(key) {
    data.push({
        version2: key,
        count: counts[key]
    });
	});


	var minVersion2 = new Date(d3.min(data, function (d){ return d.version2+"-01"}));
	var maxVersion2 = new Date(d3.max(data, function (d){ return d.version2+"-30"}));

	y.domain([0, d3.max(data, function(d) { return d.count; })]).nice();
	x.domain([minVersion2, maxVersion2]).nice();

	svg.append("g")
		    .attr("class", "y axis")
				.attr("fill", "white")
		    .call(yAxis)
		  .append("text")
				.attr("x", 25)
		    .attr("y", -20)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
				.attr("fill", "white")
		    .text("Changes");

	svg.append("g")
		    .attr("class", "x axis")
				.attr("transform", "translate(0," + timeheight + ")")
				.attr("fill", "white")
		    .call(xAxis);

	var rects = svg.selectAll(".bar")
				  .data(data)
				.enter().append("rect")
				  .attr("class", "bar")
				  .attr("x", function(d) { return x(new Date(d.version2)); })
				  .attr("width", timewidth / data.length -2) 
				  .attr("y", function(d) { return y(d.count) })
				  .attr("height", function(d) { return timeheight - y(d.count);})
					.attr("fill", "white");	

var parseDate = d3.time.format("%Y-%m-%d").parse;
var parseDate2 = d3.time.format("%b %d %Y").parse;

var date1 = parseDate2(document.getElementById("date1").value);
var date2 = parseDate2(document.getElementById("date2").value);

var brush = d3.svg.brush()
	.x(x)
	.extent([date1, date2])
	.on("brush", brushmove)
	.on("brushend", brushend);

svg.append("g")
	.attr("class", "brush")
	.call(brush)
.selectAll('rect')
	.attr('height', timeheight);

var hold = -1;

var date1Up = document.getElementById("date1Up");
date1Up.onmouseup = function(){ hold = 0;};
date1Up.onmouseout = function(){ hold = 0;};
date1Up.onmousedown = function () { hold = -1; holdit("date1", "up");};

var date1Down = document.getElementById("date1Down");
date1Down.onmouseup = function(){ hold = 0;};
date1Down.onmouseout = function(){ hold = 0;};
date1Down.onmousedown = function () { hold = -1; holdit("date1", "down");};

var date2Up = document.getElementById("date2Up");
date2Up.onmouseup = function(){ hold = 0;};
date2Up.onmouseout = function(){ hold = 0;};
date2Up.onmousedown = function () { hold = -1; holdit("date2", "up");};

var date2Down = document.getElementById("date2Down");
date2Down.onmouseup = function(){ hold = 0;};
date2Down.onmouseout = function(){ hold = 0;};
date2Down.onmousedown = function () { hold = -1; holdit("date2", "down");};

var date1Field = document.getElementById("date1");
date1Field.addEventListener("keydown", function (e) {
	if(e.keyCode === 13){
		var newDate = Date.parse(date1Field.value);
		if(newDate != null){
			if(newDate < minVersion2){
				newDate = minVersion2;
			} else if(newDate > maxVersion2){
				newDate = maxVersion2;
			}
			brush.extent([newDate, date2]);
			date1 = newDate;
			extent = brush.extent();
			brushed();
		} else {
			alert("Please enter a correct date.");
		}

	}
});


var date2Field = document.getElementById("date2");
date2Field.addEventListener("keydown", function (e) {
	if(e.keyCode === 13){
		var newDate = Date.parse(date2Field.value);
		if(newDate != null){
			if(newDate < minVersion2){
				newDate = minVersion2;
			} else if(newDate > maxVersion2){
				newDate = maxVersion2;
			}
			brush.extent([date1, newDate]);
			date2 = newDate;
			extent = brush.extent();
			brushed();
		} else {
			alert("Please enter a correct date.");
		}
	}
});

function holdit(btn, mode) {
	if (hold == -1){
		setTimeout(function(){
			if(mode === "up"){
				var newDate = Date.parse(document.getElementById(btn).value).add(1).days();
				document.getElementById(btn).value = newDate.toString().substr(4,11);
				if(btn == "date2"){
					brush.extent([date1, newDate]);
					date2 = newDate;
				} else {
					brush.extent([newDate, date2]);
					date1 = newDate;
				}
				extent = brush.extent();
				brushed();
			} else {
				var newDate = Date.parse(document.getElementById(btn).value).add(-1).days();
				document.getElementById(btn).value = newDate.toString().substr(4,11);
				if(btn == "date2"){
					brush.extent([date1, newDate]);
					date2 = newDate;
				} else {
					brush.extent([newDate, date2]);
					date1 = newDate;
				}
				extent = brush.extent();
				brushed();
			}
					
			holdit(btn, mode);
		}, 100);
  }
};

function brushed() {
	svg.select(".brush").call(brush);
}

function brushmove() {
	extent = brush.extent();
	document.getElementById("date1").value = window.extent[0].toString().substr(4,11);
	document.getElementById("date2").value = window.extent[1].toString().substr(4,11);
}

function brushend() {
	extent = brush.extent();
}

});

