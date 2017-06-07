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

  // sorted cell data based on most common cell-types
  cell_data = _.sortBy(cell_data, 'sorting_mean').reverse();


  // make bar graph
  ////////////////////

  d3.select('#container-id-1 h1')
   .remove();

  var svg_height = 500;
  var svg_width = 500;
  var bar_width = 180;
  var bar_height = 20;
  var bar_offset = 23;
  var title_height = 27;
  var top_margin = 30;
  var left_margin = 10;

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

  // loop through data
  var max_bar_value = cell_data[0].sorting_mean;

  var bar_scale = d3.scale.linear()
                    .domain([0, max_bar_value])
                    .range([0, bar_width]);

  // _.each(cell_data, function(inst_data){
  //   console.log(inst_data.sorting_mean);
  // });

  var bar_graph_container = main_svg
    .append('g')
    .attr('transform','translate('+ left_margin +', '+ top_margin +')')

  // make bar groups
  var bar_groups = bar_graph_container
    .selectAll('g')
    .data(cell_data)
    .enter()
    .append('g')
    .attr('transform', function(d,i){
      var inst_y = i * bar_offset;
      return 'translate(0, ' + inst_y + ')';
    })
    .append('text')
    .text('something')


});