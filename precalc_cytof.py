def main():

  # combine_pma_plasma()

  precalc_col_zscore()


def combine_pma_plasma():

  from copy import deepcopy
  import pandas as pd
  from clustergrammer import Network

  net_Plasma = deepcopy(Network())
  net_PMA = deepcopy(Network())

  net_Plasma.load_file('cytof_data/Plasma.txt')
  net_PMA.load_file('cytof_data/PMA.txt')

  tmp_df_Plasma = net_Plasma.dat_to_df()
  df_Plasma = tmp_df_Plasma['mat']

  tmp_df_PMA = net_PMA.dat_to_df()
  df_PMA = tmp_df_PMA['mat']

  print('Plasma shape '+ str(df_Plasma.shape))
  print('PMA shape '+ str(df_PMA.shape))

  # add categories to plasma cells
  ####################################
  rows_plasma = df_Plasma.index.tolist()
  new_rows = []
  for inst_row in rows_plasma:
    inst_name = 'Cell: Plasma-'+inst_row
    new_rows.append(inst_name)

  df_Plasma.index = new_rows

  # add categories to PMA cell s
  rows_pma = df_PMA.index.tolist()
  new_rows = []
  for inst_row in rows_pma:
    inst_name = 'Cell: PMA-'+inst_row
    new_rows.append(inst_name)

  df_PMA.index = new_rows

  df_both = pd.concat([df_Plasma, df_PMA], axis=0)

  df_both.to_csv('cytof_data/Plasma-PMA.txt', sep='\t')

  print(df_both.shape)

def precalc_col_zscore():
  '''
  precalculate column zscoring
  '''

  from copy import deepcopy
  from clustergrammer import Network

  data_types = ['Plasma', 'PMA', 'Plasma-PMA']

  for inst_data in data_types:
    net = deepcopy(Network())

    filename = 'cytof_data/' + inst_data + '.txt'

    net.load_file(filename)

    net.normalize(axis='col', norm_type='zscore')

    net.write_matrix_to_tsv('cytof_data/' + inst_data + '_col-zscore.txt')

main()