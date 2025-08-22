# Digit Recognition

This project is a web application that recognizes handwritten digits. It uses a K-Nearest Neighbors (KNN) classifier trained on the MNIST dataset.

## Description

The project consists of a Flask web application that allows users to draw a digit on a canvas and get a prediction from the trained model. The model is a KNN classifier trained on the MNIST dataset with data augmentation.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/digit-recognition.git
    ```
2.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage
1. Run the `digit-recognition.ipynb` notebook to get the model file

2.  Run the Flask application:
    ```bash
    python main.py
    ```
2.  Open your browser and go to `http://127.0.0.1:5000`.
3.  Draw a digit on the canvas and click the "Predict" button.

## Project Structure

```
.
├── data
│   └── openml
├── images
├── models
│   └── knn_digit_recognition_model.pkl
├── notebooks
│   └── digit-recognition.ipynb
├── static
│   ├── script.js
│   └── style.css
├── templates
│   └── index.html
├── .gitignore
├── main.py
├── pyproject.toml
├── README.md
└── uv.lock
```

## Model Training

The model was trained in the `notebooks/digit-recognition.ipynb` notebook. The notebook performs the following steps:

1.  Loads the MNIST dataset from `fetch_openml`.
2.  Preprocesses the data.
3.  Augments the data with random rotations, shifts, and zooms.
4.  Trains a `KNeighborsClassifier` model.
5.  Evaluates the model with a classification report and a confusion matrix.
6.  Saves the trained model to `models/knn_digit_recognition_model.pkl`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
