import flask
import pickle
import numpy as np

app = flask.Flask(__name__)

filename = "models/knn_digit_recognition_model.pkl"
model = pickle.load(open(filename, "rb"))

@app.route('/')
def home():
    return flask.render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = flask.request.get_json()
    image = data["image"]
    image = np.array(image, dtype=np.float32)
    image = image.reshape(1, -1)
    prediction = model.predict(image)

    return flask.jsonify({'prediction': int(prediction[0])})

if __name__ == "__main__":
    app.run(debug=True)
