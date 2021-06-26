from flask import Flask, request
from flask_cors import CORS
import cv2
import numpy as np
import dlib
import time
import VideoCapture
import face_recognition as fr
from tkinter import Tk
from deepface import DeepFace
import matplotlib.pyplot as plt
import face_recognition


app = Flask(__name__)
CORS(app)

@app.route('/', methods = ['get'])
def index():
  # Detect the coordinates
  detector = dlib.get_frontal_face_detector()

  cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

  while True:
      # Capture frame-by-frame
      ret, frame = cap.read()
      # mirrors the image, I prefer it like that
      frame = cv2.flip(frame, 1)

      # RGB to grayscale, need to process it as grayscale
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = detector(gray)

      # Iterator to count faces
      i = 0
      result = 0

      for face in faces:
          # Get the coordinates of faces
          x, y = face.left(), face.top()
          x1, y1 = face.right(), face.bottom()
          cv2.rectangle(frame, (x, y), (x1, y1), (0, 255, 0), 2)

          roi_gray = gray[y:y + y1, x:x + x1]
          img_item = "img-test" + str(i)+".jpg"
          cv2.imwrite(img_item, roi_gray)

          # Increment iterator for each face in faces
          i = i + 1

          # Display the box and faces
          cv2.putText(frame, 'face num' + str(i), (x - 10, y - 10),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
          #print(face, i)
          imageID = cv2.imread("imageID.jpg")
          first_face_id = cv2.imread("first_face_id.jpg")
          # result = DeepFace.verify(imageID, first_face_id,'VGG-Face','cosine',None,False)
          # print(result["verified"])

      # Display the resulting frame
      #TODO REMOVE
      cv2.imshow('frame', frame)

      # This command let's us quit with the "q" button on a keyboard.
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break


      #Code to constantly check for the number of faces
      if i > 1:
          print('Multiple faces detected!')
          result = -1
          print(result)
          cap.release()
          cv2.destroyAllWindows()
          return(str(result))


      #Testing
      if cv2.waitKey(1) & 0xFF == ord('w'):
          img_key = 'imgOnKey.jpg'
          cv2.imwrite(img_key, roi_gray)
          break



  cap.release()
  cv2.destroyAllWindows()
  return "0"


@app.route('/checkid', methods = ['get'])
def checkId():
  takePhoto()
  detector = dlib.get_frontal_face_detector()
  cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

  while True:
      ret, frame = cap.read()
      frame = cv2.flip(frame, 1)
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      cv2.imshow('frame', frame)
      faces = detector(gray)
      if(len(faces)>0):
        for face in faces:
            x, y = face.left(), face.top()
            x1, y1 = face.right(), face.bottom()
            roi_gray = gray[y:y + y1, x:x + x1]
            face_img = "first_face_id.jpg"
            cv2.imwrite(face_img, roi_gray)
            print(face)
            cap.release()
            cv2.destroyAllWindows()
            return "OK"

      # Display the resulting frame
      #TODO REMOVE
      cv2.imshow('frame', frame)

      # This command let's us quit with the "q" button on a keyboard.
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break

  cap.release()
  cv2.destroyAllWindows()
  return "0"



@app.route('/photo', methods = ['get'])
def takePhoto():

  videoCaptureObject = cv2.VideoCapture(0, cv2.CAP_DSHOW)
  # time.sleep(0.1)
  result = True
  while(result):
    ret,frame = videoCaptureObject.read()
    cv2.imwrite("imageID.jpg",frame)
    result = False
  videoCaptureObject.release()
  # ret,frame = videoCaptureObject.read()
  # while True:
  #   cv2.imshow('frame', frame)
  cv2.destroyAllWindows()
  return "NULL"

  

if __name__ == '__main__':
  app.run(debug=True)