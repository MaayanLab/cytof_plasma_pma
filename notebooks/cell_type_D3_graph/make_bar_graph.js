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

  // cell-type colors
  ct_colors = {};
  ct_colors['B cells'] = '#22316C';
  ct_colors['Basophils'] = '#000033';
  ct_colors['CD14hi monocytes'] = 'yellow';
  ct_colors['CD14low monocytes'] = '#93b8bf';
  ct_colors['CD1c DCs'] = '#3636e2';
  ct_colors['CD4 Tcells'] = 'blue';
  ct_colors['CD4 Tcells_CD127hi'] = '#FF6347';
  ct_colors['CD4 Tcells CD161hi'] = '#F87531';
  ct_colors['CD4 Tcells_Tregs'] = '#8B4513';
  ct_colors['CD4 Tcells+CD27hi'] = '#330303';
  ct_colors['CD8 Tcells'] = '#ffb247';
  ct_colors['Neutrophils'] = 'purple';
  ct_colors['NK cells_CD16hi'] = 'red';
  ct_colors['NK cells_CD16hi_CD57hi'] = 'orange';
  ct_colors['NK cells_CD56hi'] = '#e052e5';
  ct_colors['Undefined'] = 'gray';

  cat_color_opacity = 0.6;

  // make bar graph
  ////////////////////

  d3.select('#container-id-1 h1')
   .remove();

  var svg_height = 1000;
  var svg_width = 1000;
  var bar_width = 300;
  var bar_height = 20;
  var bar_offset = 46;
  var title_height = 27;
  var top_margin = 30;
  var left_margin = 30;
  var plasma_label_offset = 16;
  var pma_label_offset = 39;

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
    .attr('fill', 'white');

  // loop through data
  var max_bar_value = cell_data[0].sorting_mean;

  var bar_scale = d3.scale.linear()
                    .domain([0, max_bar_value])
                    .range([0, bar_width]);

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
      var inst_y = i * bar_offset * 1.1;
      return 'translate(0, ' + inst_y + ')';
    });

  // make bars
  bar_groups
    .append('rect')
    .attr('height', bar_height+'px')
    .attr('width', function(d){
      var inst_width = bar_scale(d.plasma_mean);
      return inst_width;
    })
    .attr('opacity', cat_color_opacity)
    .attr('fill', function(d){
      return ct_colors[d.name];
    })
    .attr('stroke', 'grey')
    .attr('stroke-width', '0.5px');

  bar_groups
    .append('rect')
    .attr('height', bar_height+'px')
    .attr('width', function(d){
      var inst_width = bar_scale(d.pma_mean);
      return inst_width;
    })
    .attr('fill', function(d){
      return ct_colors[d.name];
    })
    .attr('opacity', cat_color_opacity)
    .attr('stroke', 'grey')
    .attr('stroke-width', '0.5px')
    .attr('transform', 'translate(0,'+ bar_offset/2 +')')

  // make bar labels
  bar_groups
    .append('text')
    .text(function(d){
      return d.name + ' + Plasma';
    })
    .attr('transform', 'translate(5,'+ plasma_label_offset +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'right');

  bar_groups
    .append('text')
    .text(function(d){
      return d.name + ' + PMA';
    })
    .attr('transform', 'translate(5,'+ pma_label_offset +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'right');


});