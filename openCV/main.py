from face_recognition.api import face_locations
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import dlib
import time
import face_recognition as fr
from tkinter import Tk
from deepface import DeepFace
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
          img_item = "face" + str(i+1)+".jpg"
          cv2.imwrite(img_item, roi_gray)

          # Increment iterator for each face in faces
          i = i + 1

          # Display the box and faces
          cv2.putText(frame, 'face num' + str(i), (x - 10, y - 10),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
          print(face, i)

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


@app.route('/photo', methods = ['get'])
def photo():
  takePhoto()
  detector = dlib.get_frontal_face_detector()
  cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

  while True:
      ret, frame = cap.read()
      cv2.imshow('frame', frame)
      frame = cv2.flip(frame, 1)
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = detector(gray)
      if(len(faces)>0):
        for face in faces:
            x, y = face.left(), face.top()
            x1, y1 = face.right(), face.bottom()
            roi_gray = gray[y:y + y1, x:x + x1]
            face_img = "first_face_id.jpg"
            TEST_WHOLE_IMG = "TEST_WHOLE_IMG.jpg"
            cv2.imwrite(face_img, roi_gray)
            cv2.imwrite(TEST_WHOLE_IMG, frame)
            cap.release()
            cv2.destroyAllWindows()
            return "OK"

      # Quit function, used for testing
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break

  cap.release()
  cv2.destroyAllWindows()
  return "-1"


def takePhoto():
  videoCaptureObject = cv2.VideoCapture(0, cv2.CAP_DSHOW)
  result = True
  while(result):
    ret,frame = videoCaptureObject.read()
    cv2.imwrite("imageID.jpg",frame)
    result = False
  videoCaptureObject.release()
  cv2.destroyAllWindows()
  return "NULL"



@app.route('/verifyid', methods = ['get'])
def verifyid():
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


      for face in faces:
          # Get the coordinates of faces
          x, y = face.left(), face.top()
          x1, y1 = face.right(), face.bottom()
          cv2.rectangle(frame, (x, y), (x1, y1), (0, 255, 0), 2)

          roi_gray = gray[y:y + y1, x:x + x1]
          img_item = "face" + str(i+1)+".jpg"
          #print(img_item)
          cv2.imwrite(img_item, roi_gray)
          cv2.imwrite("DETECTED_FACE_IMG.jpg", frame)

          # Increment iterator for each face in faces
          i = i + 1

          # Display the box and faces
          cv2.putText(frame, 'face num' + str(i), (x - 10, y - 10),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
          print(face, i)

          if i > 0:
            imageID = face_recognition.load_image_file("face1.jpg")
            imageID = cv2.cvtColor(imageID, cv2.COLOR_BGR2RGB)
            first_face_id = face_recognition.load_image_file("first_face_id.jpg")
            first_face_id = cv2.cvtColor(first_face_id, cv2.COLOR_BGR2RGB)

            if imageID[0].any: 
              idLoc = face_recognition.face_locations(imageID)[0]
              encodeId = face_recognition.face_encodings(imageID)[0]
              cv2.rectangle(imageID,(idLoc[3],idLoc[0]),(idLoc[1],idLoc[2]),(255,0,255),2)

              faceLoc = face_recognition.face_locations(first_face_id)[0]
              encodeFace = face_recognition.face_encodings(first_face_id)[0]
              cv2.rectangle(first_face_id,(faceLoc[3],faceLoc[0]),(faceLoc[1],faceLoc[2]),(255,0,255),2)

              results = face_recognition.compare_faces([encodeId], encodeFace)
              print(results)
            if results[0] == True: 
              cap.release()
              cv2.destroyAllWindows()
              return "IDENTIFIED"
            else:
              cap.release()
              cv2.destroyAllWindows()
              return "UNIDENTIFIED"

      # Display the resulting frame
      #TODO REMOVE
      cv2.imshow('frame', frame)

      # This command let's us quit with the "q" button on a keyboard.
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break



if __name__ == '__main__':
  app.run(debug=True)