#!/usr/bin/env python

from joblib import load
import scipy
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


game_labels = load('game_labels.joblib')
trope_labels = load('trope_labels.joblib')
dataset = load('dataset.joblib')


document_frequency = dataset.sum(axis=0)

document_length = dataset.sum(axis=1)

tf_idf = scipy.sparse.dok_matrix(dataset.shape)

coo_dataset = dataset.tocoo(copy=False)

for (i, j, val) in zip(coo_dataset.row, coo_dataset.col, coo_dataset.data):
  tf_idf[i, j] = 1 / document_length[i, 0] * np.log(document_frequency.size / document_frequency[0, j])

games = []

for i, label in enumerate(game_labels):
  coo_row = dataset[i, :].tocoo(copy=False)
  games.append({
    'id': i,
    'name': label,
    'tropes': sorted(trope_labels[j] for j in coo_row.col)
  })

games.sort(key=lambda x: x['name'])


with open('games.json', 'w') as f:
  f.write(json.dumps(games, indent=2))

similarity = cosine_similarity(tf_idf)

with open('similarities.json', 'w') as f:
  f.write(json.dumps(similarity, indent=2))


