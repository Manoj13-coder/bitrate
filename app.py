from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import pandas as pd

app = Flask(__name__)
cors = CORS(app, resources={r"/poses/*": {"origins": "*"}})


@app.route('/poses', methods=['POST'])
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
    print(result)
    return jsonify({'result': str(result)})
    #return "{'result':" + str(result) + "}"

if __name__ == '__main__':
    #app.run(ssl_context='adhoc', host='0.0.0.0', debug=True, port=5000)
    #app.run(ssl_context=('cert.pem', 'key.pem'),  host='0.0.0.0', debug=True, port=5000)
    app.run(host='0.0.0.0', debug=True, port=5000)