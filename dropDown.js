var alertChange2 = function(d,i) {
		console.log("!!!!!!!", window.extent);	
  	switch(d){
			case "Overview Bives Changes":
				bivesOverview(window.extent[0], window.extent[1]);
				break;
			case "Comparison Unix-Bives":
				donut(window.extent[0], window.extent[1]);
				break;
		}
    var selection = d3.select(this);
    
    console.log(selection.text() + " index: " + i + " value: " + d);
};


d3.select("#select-list2").selectAll("option")
    .datum(function(d){return d3.select(this).attr("value");})
    .on("click", alertChange2);
