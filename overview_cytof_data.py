def main():
  from copy import deepcopy
  from clustergrammer import Network
  print('here')

  filename = 'cytof_data/tmp_down.txt'

  net = Network()

  net.load_file(filename)

  # net.normalize(axis='col', norm_type='zscore', keep_orig=True)

  # net.filter_N_top('row', 250, rank_type='sum')

  viz_net = deepcopy(net)

  viz_net.make_clust(dist_type='cos',views=['N_row_sum', 'N_row_var'] , dendro=True,
               sim_mat=True, filter_sim=0.1, calc_cat_pval=False)

  # write jsons for front-end visualizations
  viz_net.write_json_to_file('viz', 'json/mult_view.json', 'indent')
  viz_net.write_json_to_file('sim_row', 'json/mult_view_sim_row.json', 'no-indent')
  viz_net.write_json_to_file('sim_col', 'json/mult_view_sim_col.json', 'no-indent')


main()