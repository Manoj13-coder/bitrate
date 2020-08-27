from flask import Flask, request 

app = Flask(__name__) 

@app.route('/poses', methods=['POST'])
def poses():
    req = request.get_json()
    print(req)
    return "Thanks!", 200


if __name__ == '__main__':
    #app.run(ssl_context='adhoc', host='0.0.0.0', debug=True, port=5000)
    app.run(ssl_context=('cert.pem', 'key.pem'),  host='0.0.0.0', debug=True, port=5000)