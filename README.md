# bitrate Dance-Song Detector

The main idea is that the web app detects which song are you dancing and starts playing it.
The application detects poses that you dance and sends them to a server. The server classifies 
each pose and determines if the pose belongs to the sequence for some song, so it can detect you are dancing that specific song. 

For the moment the application only supports the song YMCA. [Here](link a youtube) you can find the prototype demo video.

The system is dividen in these components: 

![components](https://user-images.githubusercontent.com/8755889/91780697-ad35dc80-ebce-11ea-9a05-fbf8d387897e.jpg)

# FE
This is the user interface to detect poses and play the song detected (in this case only YMCA or not YMCA). When is not YMCA, we play sound created with magenta. 

When the camera detects a pose, is saved in a list of poses until 8 poses are reached. Afterwards, they are sent to the classifier that detects if those poses are from the YMCA song and if 80% of them are positive, the YMCA song starts playing. Otherwise, the music generator is called to generate a sound using magenta, that will be played. 

# Classifier server (YMCA Classifier)
The classifier is implemented in python applying a `RandomForest` model from `sklearn` library, reaching an accuracy of 0.85. This is prepacked in a docker.   
You can find the code [here](/classifier/ymca_classifier.ipynb).    

# Music Generator
We use magenta to generate a sound using the `tensorFlow/magenta` docker image that contains different pre-trained models to be used. In particular, we use `lookback_rnn` model. We generate the `primer_melody` from random numbers between 0 and 127. You can find the code [here](/music_generator/music.py).    

# Steps to start dancing !!  
- Run the server:
```bash
	docker run -d -p 8081:6000 mikaelapisani/bitrate-generate:latest
```
- Run the classifier: 
```bash
	docker run -d -p 5000:5000 mikaelapisani/bitrate-classify:latest
```
- Run FE: Open browser and open index.xml (allow camera if asked)
- Start Dancing!

- If your poses are from the YMCA song, the song will start playing.
- If your poses aren't from the YMCA song, you will listen to sounds created with magenta


## TBD 
1. Improve web page desing
2. Improve Classifier's accuracy by adding more data and tunning the model, since it has been trained only in data from people of the group. In order to be more accurate we would need to add more data from different people with different shapes of the body and sizes. In addition, people might do differently the poses for the same song. So, we probably will have overfitting if the model is being tested with other people.     
3. Add support for more songs: train other classifiers to identify which song is being danced.     
4. In the future it would be good to be able to create dynamically support for new songs, training the model with data. For this feature several steps are needed:     
- Have a view to capture poses for a certain song  
- The system would need to train the model with the data generated     
- Once the model is trained it should be integrated in the server to classify poses against the new song    
  
