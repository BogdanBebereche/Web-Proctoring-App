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

  detector = dlib.get_frontal_face_detector()
  cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

  while True:
      ret, frame = cap.read()
      frame = cv2.flip(frame, 1)

      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = detector(gray)

      i = 0
      result = 0

      for face in faces:
          x, y = face.left(), face.top()
          x1, y1 = face.right(), face.bottom()
          cv2.rectangle(frame, (x, y), (x1, y1), (0, 255, 0), 2)

          roi_gray = gray[y:y + y1, x:x + x1]
          img_item = "face" + str(i+1)+".jpg"
          cv2.imwrite(img_item, roi_gray)

          i = i + 1

          cv2.putText(frame, 'face num' + str(i), (x - 10, y - 10),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
          print(face, i)

      # Display the resulting frame
      #TODO REMOVE
      cv2.imshow('During exam', frame)

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


  cap.release()
  cv2.destroyAllWindows()
  return "0"


@app.route('/photo', methods = ['get'])
def photo():
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
            id_face_image = "id_face_image.jpg"
            id_whole_image = "id_whole_image.jpg"
            bgr_face = frame[y:y + y1, x:x + x1]
            cv2.imwrite(id_face_image, bgr_face)
            cv2.imwrite(id_whole_image, frame)
            cap.release()
            cv2.destroyAllWindows()
            return "OK"

      # Quit function, used for testing
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break


def convert_and_trim_bb(image, rect):
	# extract the starting and ending (x, y)-coordinates of the
	# bounding box
	startX = rect.left()
	startY = rect.top()
	endX = rect.right()
	endY = rect.bottom()
	# ensure the bounding box coordinates fall within the spatial
	# dimensions of the image
	startX = max(0, startX)
	startY = max(0, startY)
	endX = min(endX, image.shape[1])
	endY = min(endY, image.shape[0])
	# compute the width and height of the bounding box
	w = endX - startX
	h = endY - startY
	# return our bounding box coordinates
	return (startX, startY, w, h)



@app.route('/verifyid', methods = ['get'])
def verifyid():
  detector = dlib.get_frontal_face_detector()
  cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

  while True:
      ret, frame = cap.read()
      frame = cv2.flip(frame, 1)
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = detector(gray)
      i = 0

      for face in faces:
          x, y = face.left(), face.top()
          x1, y1 = face.right(), face.bottom()
          # cv2.rectangle(frame, (x, y), (x1, y1), (0, 255, 0), 2)

          roi_gray = gray[y:y + y1, x:x + x1]
          img_item = "face" + str(i+1)+".jpg"
          cv2.imwrite(img_item, roi_gray)
          cv2.imwrite("verification_image.jpg", frame)


          i = i + 1
          print(face, i)

          if i > 0:
            imageID = face_recognition.load_image_file("id_whole_image.jpg")
            imageID = cv2.cvtColor(imageID, cv2.COLOR_BGR2RGB)
            first_face_id = face_recognition.load_image_file("verification_image.jpg")
            first_face_id = cv2.cvtColor(first_face_id, cv2.COLOR_BGR2RGB)

            if imageID[0].any: 
              idLoc = face_recognition.face_locations(imageID)[0]
              encodeId = face_recognition.face_encodings(imageID)[0]
              cv2.rectangle(imageID,(idLoc[3],idLoc[0]),(idLoc[1],idLoc[2]),(255,0,255),2)

              faceLoc = face_recognition.face_locations(first_face_id)[0]
              encodeFace = face_recognition.face_encodings(first_face_id)[0]
              cv2.rectangle(first_face_id,(faceLoc[3],faceLoc[0]),(faceLoc[1],faceLoc[2]),(255,0,255),2)

              results = face_recognition.compare_faces([encodeId], encodeFace, 0.6)
              print(results)
            if results[0] == True: 
              cap.release()
              cv2.destroyAllWindows()
              return "IDENTIFIED"
            else:
              cap.release()
              cv2.destroyAllWindows()
              return "UNIDENTIFIED"

      #TODO REMOVE
      cv2.imshow('frame', frame)

      # This command let's us quit with the "q" button on a keyboard.
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break



# #TODO UNUSED
# def takePhoto():
#   videoCaptureObject = cv2.VideoCapture(0, cv2.CAP_DSHOW)
#   result = True
#   while(result):
#     ret,frame = videoCaptureObject.read()
#     cv2.imwrite("imageID.jpg",frame)
#     result = False
#   videoCaptureObject.release()
#   cv2.destroyAllWindows()
#   return "NULL"


if __name__ == '__main__':
  app.run(debug=True)