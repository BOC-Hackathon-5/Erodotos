FROM python:3.10-slim-buster
LABEL maintainer="Erodotos Demetriou <erodotosd@gmail.com>"

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . /app

# Creates a non-root user and adds permission to access the /app folder
RUN useradd appuser && chown -R appuser /app
USER appuser

EXPOSE 8080

ENTRYPOINT ["uvicorn","main:app", "--port", "8080"]
