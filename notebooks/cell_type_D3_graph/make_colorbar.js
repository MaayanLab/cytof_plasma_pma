d3.select('#container-id-1 h1')
 .remove();

var svg_height = 1000;
var svg_width = 1000;

var colorbar_width = 500;
var colorbar_height = 10;

var main_svg = d3.select('#container-id-1')
  .append('svg')
  .attr('height', svg_height + 'px')
  .attr('width', svg_height + 'px');

// make background
main_svg
  .append('rect')
  .classed('background', true)
  .attr('height', colorbar_height + 'px')
  .attr('width', colorbar_width + 'px')
  .attr('fill', 'red')
  .attr('transform', 'translate(10, 10)');