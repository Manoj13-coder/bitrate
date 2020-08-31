# bitrate Dance-Song Detector

The main idea is that the web app detects which song are you dancing and starts playing it.
The application detects poses that you dance and sends them to a server. The server classifies 
each pose and determines if the pose belongs to the sequence for the song YMCA. 

For the moment the application only supports the song YMCA. 

# UI
Open the index.xml in a Chrome browser and allow the camera. 

# Classifier server
The classifier is implemented in python applying a RandomForest model. Reaching an accuracy of 0.85.    
You can find the code [ymca_classifier.ipynb](ymca_classifier.ipynb).    


## Run Locally

First create a virtualenv and install dependencies:     
```bash
	cd classifier
	virtualenv venv
	source  venv/bin/activate
	pip install -r requirements.txt
```

Then, run the server:    
```bash
	python app.py
```

## Docker 
```bash
	docker run -d -p 5000:5000 mikaelapisani/bitrate-classify:latest
```

## Docker 
```bash
	docker run -d -p 8081:6000 mikaelapisani/bitrate-generate:latest
```


# Start dancing !!  
- Run the server
- Open browser
- Open index.xml
- Allow camera 


## TBD 
1. Improve web page desing
2. Improve Classifier's accuracy by adding more data and tunning the model. Since it has been trained only in data from people of the group. In order to be more accurate we would need to add more data from different people with different shapes of the body and sizes. In addition, people might do differently the poses for the same song. So, we probably will have overfitting if the model is being tested with other people.     
3. Add support for more songs: train other classifiers to identify which song is being dancing.     
4. In the future it would be good to be able to create dynamically support for new songs, training the model with data. For this feature several steps are needed:     
- Have a view to capture poses for a certain song  
- The system would need to train the model with the data generated     
- Once the model is trained it should be integrated in the server to classify poses against the new song    
  




