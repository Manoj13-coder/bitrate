#!/bin/sh

export MAG_DATA_HOME=${HOME}/magenta-data
root@cb79624f1d77:/magenta-data# cat set
setenv.sh  setup.sh   
root@cb79624f1d77:/magenta-data# cat setup.sh 
#!/bin/sh

# Create directories
mkdir -p ${MAG_DATA_HOME}/priming-input
mkdir -p ${MAG_DATA_HOME}/trained-models
mkdir -p ${MAG_DATA_HOME}/music-output


# Download pre-trained model melody_rnn attention
curl -s -o ${MAG_DATA_HOME}/trained-models/melody_rnn_attention.mag http://download.magenta.tensorflow.org/models/attention_rnn.mag

# Download a priming melody midi file that we will use later
curl -s -o ${MAG_DATA_HOME}/priming-input/Bhairav.mid http://en.midimelody.ru/midi.php?str=%2Fi%2FIndian%20Raga%2FIndian%20Raga%20-%20Bhairav.mid