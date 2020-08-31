from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os
import random


app = Flask(__name__)
cors = CORS(app, resources={r"/music/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/music/generate', methods=['GET','OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def generate():
    trackname = request.args.get('track_name')

    primer_melody = random.sample(range(0, 127), 4)
    command = os.popen("melody_rnn_generate --config=attention_rnn \
        --bundle_file=/magenta-models/lookback_rnn.mag  \
        --output_dir=/magenta-data/music-output/ \
        '--hparams=batch_size=128,rnn_layer_sizes=[128,128]' \
        --num_outputs=1 --num_steps=128 \
        --primer_melody='"+ str(primer_melody) +"'")
    print(command.read())
    command.close()
    generated_files = os.listdir('/magenta-data/music-output/')
    os.popen("timidity -Ow -o - /magenta-data/music-output/" + generated_files[0] + " | lame - /magenta-data/music-output/" + trackname)
    
    try:
        return send_from_directory('/magenta-data/music-output/', filename=trackname, as_attachment=True)
    except Exception as ex:
        print(ex)
        return 'Error'

if __name__ == '__main__':
     app.run(host='0.0.0.0', debug=True, port=6000)


