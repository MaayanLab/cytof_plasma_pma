def main():

  precalc_col_zscore()

def precalc_col_zscore():
  '''
  precalculate column zscoring
  '''

  from copy import deepcopy
  from clustergrammer import Network

  data_types = ['Plasma', 'PMA']

  for inst_data in data_types:
    net = deepcopy(Network())

    filename = 'cytof_data/' + inst_data + '.txt'

    net.load_file(filename)

    net.normalize(axis='col', norm_type='zscore')

    net.write_matrix_to_tsv('cytof_data/' + inst_data + '_col-zscore.txt')

main()