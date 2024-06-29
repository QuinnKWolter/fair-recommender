from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.stats import entropy
import pickle, copy

import rpy2.robjects as ro
import rpy2.robjects.packages as rpackages
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
from rpy2.robjects.conversion import localconverter
from rpy2.robjects import globalenv

import umap.umap_ as umap
from sklearn.manifold import TSNE

class LoadData(APIView):
    def get(self, request, format=None):
        r = ro.r
        target_id = 5
        model_name = 'bpr'
        mode = 'if_i_were' # if_i_were or if_i_preferred
        simulated_cats = {'Drama': 0.1, 'Romance': 0.1}
        categories = ['Action', 'Adventure', 'Animation', "Childrens", 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Fantasy', 'FilmNoir', 'Horror',
            'Musical', 'Mystery', 'Romance', 'Scifi', 'Thriller', 'War',
            'Western'
            ]
        
        actual_uvs = pickle.load(open('./static/data/actual_uvs_all.pkl', 'rb'))
        pred_uvs = pickle.load(open('./static/data/pred_uvs_all.pkl', 'rb'))
        mean_uvs = pickle.load(open('./static/data/mean_uvs_all.pkl', 'rb'))
        mean_uvs_2d = pickle.load(open('./static/data/mean_uvs_2d_all.pkl', 'rb'))
        # categories = pickle.load(open('./static/data/categories.pkl', 'rb')).tolist()

        df_users = pd.read_csv('./static/data/df_users_all_w_coords_bpr.csv')
        # nan_df = np.where(np.asanyarray(np.isnan(df_users)))
        row_idx_w_null = df_users.loc[pd.isna(df_users).any(axis=1), :].index.values
        df_users = df_users.loc[~df_users.index.isin(row_idx_w_null)].reset_index(drop=True)
        actual_uvs = np.delete(actual_uvs, row_idx_w_null, 0)
        pred_uvs = np.delete(pred_uvs, row_idx_w_null, 0)

        pred_arith_mean_uv_2d = mean_uvs_2d[0]
        pred_geo_mean_uv_2d = mean_uvs_2d[1]
        actual_arith_mean_uv_2d = mean_uvs_2d[2]
        actual_geo_mean_uv_2d = mean_uvs_2d[3]

        protos = _find_prototypes(df_users)

        print('pred_geo_mean_uv_2d; ', pred_arith_mean_uv_2d, pred_geo_mean_uv_2d)

        df_actual_uvs = pd.DataFrame(actual_uvs, columns=categories)
        df_pred_uvs = pd.DataFrame(pred_uvs, columns=categories)

        df_actual_uvs.to_csv('./static/data/df_actual_uvs.csv')
        df_users.to_csv('./static/data/df_users.csv')
        df_users_actual = pd.concat([df_users[['userID', 'gender', 'age', 'occupation', 'zip_code']], df_actual_uvs], axis=1)
        df_users_pred = pd.concat([df_users[['userID', 'gender', 'age', 'occupation', 'zip_code']], df_pred_uvs], axis=1)

        target_user_info = df_users_actual.loc[df_users_actual['userID']==target_id]
        target_idx = target_user_info.index
        target_actual_uv = actual_uvs[target_idx].flatten()
        target_pred_uv = pred_uvs[target_idx].flatten()

        # for idx, (id, user) in enumerate(df_users.iterrows()):
        #     diversity_actual = 1 - entropy(actual_uvs_all[idx])
        #     diversity_pred = 1 - entropy(pred_uvs_all[idx])
        #     df_users.loc[id, 'filterBubble'] = diversity_actual - diversity_pred

        df_users = find_counterfactual_users(
            mode,
            target_pred_uv,
            target_actual_uv,
            df_users_actual,
            df_users_pred,
            df_users,
            categories,
            simulated_cats,
        )

        return Response({
            'users': df_users.to_dict(orient='records'),
            'predUVs': pred_uvs,
            'actualUVs': actual_uvs,
            'meanUV': pred_arith_mean_uv_2d.flatten().tolist(),
            'protos': protos.to_dict(orient='records')
            # 'cfIdx': cf_indices
        })
    
def _simulate_prefs(uv, categories, simulated_cats):
    uv_updated = copy.deepcopy(uv)
    for cat, score in simulated_cats.items():
        uv_updated[categories.index(cat)] = score
    return uv_updated

def _find_prototypes(df_users):
    protos = df_users.loc[:10]
    return protos

def find_counterfactual_users(
    mode,
    target_pred_uv,
    target_actual_uv,
    df_users_actual,
    df_users_pred,
    df_users,
    categories,
    simulated_cats,
):
    user_demographic = ['gender', 'age']
    all_vars = user_demographic + categories

    # Set counterfactual simulations
    simulated_target_pred_uv = _simulate_prefs(target_pred_uv, categories, simulated_cats)
    simulated_vars = ['gender'] if mode == 'if_i_were' else simulated_cats.keys()
    control_vars = list(set(all_vars) - set(simulated_vars))
    cf_condition = 'F'

    # Construct a factual set (the focal user and nearest neighbors)
    NN = NearestNeighbors(n_neighbors=10, radius=0.2).fit(actual_uvs)
    nn_distances, nn_indices = NN.kneighbors(target_actual_uv.reshape(1, -1))
    nn_indices = nn_indices.flatten().tolist()

    df_users_actual.loc[nn_indices, 'cf_binary'] = 1
    df_users_actual.loc[~df_users_actual.index.isin(nn_indices), 'cf_binary'] = 0

    # Install and load R packages
    with localconverter(ro.default_converter + pandas2ri.converter):
        # utils = rpackages.importr('utils')
        # utils.chooseCRANmirror(ind=1)
        # utils.install_packages("MatchIt")
        matchit = rpackages.importr("MatchIt")

        df_users_actual_r = ro.conversion.py2rpy(df_users_actual)
        df_users_pred_r = ro.conversion.py2rpy(df_users_pred)
        categories_r = ro.vectors.StrVector(list(categories))

        globalenv['dfr_if'] = df_users_actual_r
        globalenv['categories'] = categories_r
        globalenv['control_vars'] = control_vars
        globalenv['data_treated'] = ''
        globalenv['matched_indices'] = ''
        globalenv['match'] = ''
        globalenv['match_summary'] = ''


        ddd = r('''
            genetic_match <- matchit(
                as.formula(paste('cf_binary ~ ', 
                                paste(control_vars, collapse='+'), 
                                collapse='')), data=dfr_if, method="genetic", pop.size=20)
            match_summary = summary(genetic_match, un = FALSE)
            data_treated <- match.data(genetic_match)
        ''')

        match_summary = globalenv['match_summary']
        print('match_summary: ', match_summary)
        print('data_treated: ', globalenv['data_treated'].shape)
        df_cf = globalenv['data_treated'].loc[globalenv['data_treated']['cf_binary'] == 0]
        cf_indices = list(df_cf.index.astype('int'))
        print('cf_indices: ', cf_indices)

    df_users['is_focal'] = [ 1 if idx in nn_indices else 0 for idx in df_users.index ]
    df_users['is_cf'] = [ 1 if idx in cf_indices else 0 for idx in df_users.index ]

    print('nn_indices: ', nn_indices)
    print('cf_indices: ', cf_indices)

    return df_users

def get_user_space(df_users, pred_uvs):
    # Dynamically get user space
    dim_red = 'tsne'
    metric = 'euclidean'
    if dim_red == 'umap':
        # Load the UMAP result 
        uvs_2d = umap.UMAP(
            n_neighbors=100,
            min_dist=0.1,
            random_state=42,
            metric=metric).fit_transform(pred_uvs)
    else:
        uvs_2d = TSNE(
            n_components=2, 
            learning_rate='auto',
            init='random', 
            perplexity=500).fit_transform(pred_uvs)
        
    df_users.loc[:,'x0_pred'] = uvs_2d[:,0]
    df_users.loc[:,'x1_pred'] = uvs_2d[:,1]

    uvs_2d = TSNE(
        n_components=2, 
        learning_rate='auto',
        init='random', 
        perplexity=800).fit_transform(pred_uvs)
        
    df_users.loc[:,'x0_pred'] = uvs_2d[:,0]
    df_users.loc[:,'x1_pred'] = uvs_2d[:,1]