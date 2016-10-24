def main():

  # load_antibody_info()

  # combine_pma_plasma()

  # precalc_col_zscore()

  # precalc_subsets()

  precalc_downsample()

def precalc_downsample():
  from clustergrammer import Network
  import numpy as np
  import pandas as pd

  net = Network()

  net.load_file('cytof_data/Plasma-PMA_col-zscore.txt')
  tmp_df = net.dat_to_df()
  df = tmp_df['mat']

  cols = df.columns.tolist()

  X = df

  from sklearn.cluster import MiniBatchKMeans

  n_clusters = 500

  # kmeans is run with rows as data-points and columns as dimensions
  mbk = MiniBatchKMeans(init='k-means++', n_clusters=n_clusters,
                        max_no_improvement=10, verbose=0)

  # need to loop through each label (each k-means cluster) and count how many
  # points were given this label. This will give the population size of each label
  # For MNIST, I also need to get the digit breakdown of each cluster to see what
  # digits make up each cluster. Then I can work on overrepresentation examples.
  ################################################
  mbk.fit(X)
  mbk_means_labels = mbk.labels_
  mbk_means_cluster_centers = mbk.cluster_centers_
  mbk_means_labels_unique = np.unique(mbk_means_labels)

  ds = mbk_means_cluster_centers

  ds_df = pd.DataFrame(data=ds, columns = cols )

  ds_df.to_csv('cytof_data/tmp_down.txt', sep='\t')


def load_antibody_info():
  print('save antibody info as dictionary')
  from clustergrammer import Network

  anti_types = ['surface_markers', 'phospho_markers']

  anti_info = {}
  for inst_type in anti_types:
    filename = 'antibody_info/' + inst_type + '.txt'
    f = open(filename)
    lines = f.readlines()

    lines = [i.strip() for i in lines]

    anti_info[inst_type] = lines

  net = Network()
  net.save_dict_to_json(anti_info, 'antibody_info/antibody_info.json',
                        indent='indent')

def precalc_subsets():
  import pandas as pd
  from clustergrammer import Network

  # df = pd.read_csv('cytof_data/Plasma-PMA_col-zscore.txt', sep='\t')

  net = Network()
  net.load_file('cytof_data/Plasma-PMA_col-zscore.txt')
  tmp_df = net.dat_to_df()
  df = tmp_df['mat']

  print(df.shape)

  num_sample = 500

  # state int(random.random()*10000)

  inst_sub = df.sample(n=num_sample, axis=0, random_state=1000)

  print(inst_sub.shape)

  inst_sub.to_csv('cytof_data/tmp_sub.txt', sep='\t')


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

  # only keep biological information
  keep_cols, antibody_info = load_keep_antibodies()

  df_keep = df_both[keep_cols]

  # add col categories
  col_cats = []
  cols = df_keep.columns.tolist()
  for inst_col in cols:

    if inst_col in antibody_info['surface_markers']:
      inst_type = 'Marker-type: surface marker'
    else:
      inst_type = 'Marker-type: phospho marker'

    inst_name = 'Antibody: ' + inst_col
    inst_tuple = (inst_name, inst_type)

    col_cats.append(inst_tuple)

  df_keep.columns = col_cats

  # add categories to cells
  rows = df_keep.index.tolist()
  row_cats = []
  for inst_row in rows:
    inst_cat = 'Treatment: ' + inst_row.split(': ')[1].split('-')[0]
    inst_tuple = ( inst_row,  inst_cat)
    row_cats.append(inst_tuple)

  df_keep.index = row_cats

  print('size of matrix when only keeping 28 antibodies ')
  print(df_keep.shape)

  df_keep.to_csv('cytof_data/Plasma-PMA.txt', sep='\t')


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

def load_keep_antibodies():
  from clustergrammer import Network
  net = Network()
  antibody_info = net.load_json_to_dict('antibody_info/antibody_info.json')
  keep_cols = []
  for inst_marker in antibody_info:
    markers = antibody_info[inst_marker]
    keep_cols.extend(markers)

  return keep_cols, antibody_info

main()