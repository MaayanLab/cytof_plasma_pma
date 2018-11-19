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


  // make svg
  //////////////////
  var cat_color_opacity = 0.6;
  var svg_height = 1000;
  var svg_width = 1000;
  var bar_width = 275;
  var bar_height = 20;
  var bar_offset = 46;
  var title_height = 27;
  var top_margin = 30;
  var left_margin = 30;
  var plasma_label_offset = 17;
  var pma_label_offset = 39;
  var title_margin_top = 15;
  var title_margin_left = 30;
  var pct_offset = 57;
  var std_offset = 110;
  var pval_offset = 160;
  var pct_num_offset = 333;
  var std_num_offset = 385;
  var pval_num_offset = 447;
  var offset_pma_nums = 37;

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

  // make title
  ///////////////
  main_svg
    .append('text')
    .text('Cell Types')
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 18)
    .attr('transform', 'translate('+title_margin_left+','+title_margin_top+')');

  var line_y = 7;
  main_svg
    .append('line')
    .attr('x1', 0)
    .attr('x2', bar_width)
    .attr('y1', line_y)
    .attr('y2', line_y)
    .attr('stroke', 'blue')
    .attr('stroke-width', 1)
    .attr('transform', 'translate('+title_margin_left+','+title_margin_top+')');

  main_svg
    .append('text')
    .text('Pct.')
    .attr('transform', function(){
      var inst_x = bar_width + pct_offset;
      var inst_y = title_margin_top;
      return 'translate(' + inst_x + ',' + inst_y + ')';
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 18);

  main_svg
    .append('text')
    .text('Std.')
    .attr('transform', function(){
      var inst_x = bar_width + std_offset;
      var inst_y = title_margin_top;
      return 'translate(' + inst_x + ',' + inst_y + ')';
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 18);

  main_svg
    .append('text')
    .text('P-val')
    .attr('transform', function(){
      var inst_x = bar_width + pval_offset;
      var inst_y = title_margin_top;
      return 'translate(' + inst_x + ',' + inst_y + ')';
    })
    .style('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style('font-weight',  800)
    .style('font-size', 18);

  // make bar graph
  ////////////////////

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


  d3.select('#container-id-1 h1')
   .remove();

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

  // make data column
  /////////////////////

  // Plasma
  bar_groups
    .append('text')
    .text(function(d){
      return Math.round(d.plasma_mean * 10)/10
    })
    .attr('transform', 'translate('+pct_num_offset+','+ plasma_label_offset +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end')

  bar_groups
    .append('text')
    .text(function(d){
      return Math.round(d.plasma_std * 10)/10;
    })
    .attr('transform', 'translate('+std_num_offset+','+ plasma_label_offset +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end')

  bar_groups
    .append('text')
    .text(function(d){
      return Math.round(d.ttest_pval * 100)/100;
    })
    .attr('transform', 'translate('+pval_num_offset+','+ plasma_label_offset +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end')

  // Plasma
  bar_groups
    .append('text')
    .text(function(d){
      return Math.round(d.pma_mean * 10)/10
    })
    .attr('transform', 'translate('+pct_num_offset+','+ offset_pma_nums +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end')

  bar_groups
    .append('text')
    .text(function(d){
      return Math.round(d.pma_std * 10)/10;
    })
    .attr('transform', 'translate('+std_num_offset+','+ offset_pma_nums +')')
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end')

});