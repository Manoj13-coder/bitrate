FROM tensorflow/magenta

RUN apt-get -y update && apt-get install -y timidity && apt-get install -y lame

RUN pip install Flask flask-cors

RUN curl https://bitbucket.org/phiprimed/amwpblog/raw/master/magenta_music_gen/setup.sh > setup.sh

RUN sh setup.sh 

COPY music.py /

CMD [ "python", "/music.py" ]