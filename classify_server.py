from bottle import run, request, route
from joblib import load
import json
import pandas as pd

THRESHOLD=5

@route('/classify', method='POST')
def process():
    body = request.body.read()
    body = body[:-1]
    clf = load('model.joblib')
    data = json.loads(body)
    df = pd.DataFrame()
    for pose in data:
        df_aux = {}
        for scores in pose:
            part = scores['part']
            df_aux['score_' + part] = scores['score']
            df_aux['position_x_' + part] = scores['position']['x']
            df_aux['position_y_' + part] = scores['position']['y']
        df = df.append(df_aux, ignore_index=True)
    return clf.predict(df.values).sum() > THRESHOLD

run(host='localhost', port=8080, debug=True)
