from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from joblib import load
import pandas as pd


app = Flask(__name__)
cors = CORS(app, resources={r"/poses/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/poses', methods=['POST','OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def poses():
    req = request.json
    data = req['value']
    clf = load('model.joblib')
    df = pd.DataFrame()
    df_aux = {}
    for pose in data:
        part = ''
        score = 0
        for key, value in pose.items():
        	if (key=='score'):
        		score = value
        	if (key=='part'):
        		part = value
        	elif (key=='position'):
        		position_x = value['x']
        		position_y = value['y']
        df_aux['score_' + part] =  score
        df_aux['position_x_' + part] = position_x
        df_aux['position_y_' + part] = position_y

    df = df.append(df_aux, ignore_index=True)
    result = clf.predict(df.values).sum()
    return jsonify({'result': bool(result>0)})
 

if __name__ == '__main__':
     app.run(host='0.0.0.0', debug=True, port=5000)