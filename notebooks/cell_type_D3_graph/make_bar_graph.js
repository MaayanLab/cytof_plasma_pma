console.log('working on making bar graph')

d3.json('PMA_cell_type_results.json', function(data){
  console.log('here')
  console.log(_.keys(data))

  d3.select('#container-id-1 h1')
    .remove();

  d3.select('#container-id-1')
    .append('text')
    .text('something new')

});