FROM python:3.9-slim

EXPOSE 5000

RUN adduser --disabled-login appuser

WORKDIR /home/appuser

ENV DATADIR=/home/appuser/data/

COPY . .

RUN pip install -r config/requirements.txt

RUN mkdir /home/appuser/data

USER appuser

ENV FLASK_APP=/home/appuser

CMD flask run --host=0.0.0.0