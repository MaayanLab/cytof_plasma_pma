d3.select('#container-id-1 h1')
 .remove();

var svg_height = 1000;
var svg_width = 1000;

var colorbar_width = 200;
var colorbar_height = 20;

var main_svg = d3.select('#container-id-1')
  .append('svg')
  .attr('height', svg_height + 'px')
  .attr('width', svg_height + 'px');



//Append a defs (for definition) element to your SVG
var defs = main_svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");


//Set the color for the start (0%)
linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "blue");

//Set the color for the end (100%)
linearGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "white");

//Set the color for the end (100%)
linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red");


// make colorbar
main_svg
  .append('rect')
  .classed('background', true)
  .attr('height', colorbar_height + 'px')
  .attr('width', colorbar_width + 'px')
  .attr('fill', 'url(#linear-gradient)')
  .attr('transform', 'translate(10, 10)');