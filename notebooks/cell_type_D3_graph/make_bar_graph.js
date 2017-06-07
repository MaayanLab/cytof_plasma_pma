console.log('working on making bar graph')

d3.json('PMA_cell_type_results.json', function(data){

  // reorganize data
  /////////////////////
  var all_types = _.keys(data);
  var inst_data;
  var inst_keys;

  // data put into array
  cell_data = [];

  _.each(all_types, function(inst_type){

    inst_data = data[inst_type];

    inst_keys = _.keys(inst_data);

    inst_obj = {};

    // transfer name
    inst_obj['name'] = inst_type;

    // transfer info from object
    _.each(inst_keys, function(tmp_key){
      inst_obj[tmp_key] = inst_data[tmp_key]
    });

    // calculate sorting_mean (average of pma and plasma)
    inst_obj['sorting_mean'] = ( inst_data['pma_mean'] + inst_data['plasma_mean'] )/2;

    cell_data.push(inst_obj);

  });


  cell_data = _.sortBy(cell_data, 'sorting_mean').reverse();

  console.log(cell_data);

  // make bar graph
  ////////////////////

  d3.select('#container-id-1 h1')
   .remove();

  var svg_height = 500;
  var svg_width = 500;

  var main_svg = d3.select('#container-id-1')
    .append('svg')
    .attr('height', svg_height + 'px')
    .attr('width', svg_height + 'px');

  // make background
  main_svg
    .append('rect')
    .classed('background', true)
    .attr('height', svg_height + 'px')
    .attr('width', svg_height + 'px')
    .attr('fill', 'blue')
    .attr('opacity', 0.3);

});