from flask import Flask, request

import cv2
import numpy as np
import dlib

app = Flask(__name__)

@app.route('/', methods = ['get'])
def index():
  # return 'Hello'
  # Detect the coordinates
  detector = dlib.get_frontal_face_detector()

  cap = cv2.VideoCapture(0)

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

      # Variable to track penalty points
      points = 0

      for face in faces:
          # Get the coordinates of faces
          x, y = face.left(), face.top()
          x1, y1 = face.right(), face.bottom()
          cv2.rectangle(frame, (x, y), (x1, y1), (0, 255, 0), 2)

          roi_gray = gray[y:y + y1, x:x + x1]
          img_item = "img-test2.png"
          cv2.imwrite(img_item, roi_gray)

          # Increment iterator for each face in faces
          i = i + 1

          # Display the box and faces
          cv2.putText(frame, 'face num' + str(i), (x - 10, y - 10),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
          print(face, i)

      # Display the resulting frame
      cv2.imshow('frame', frame)

      # This command let's us quit with the "q" button on a keyboard.
      if cv2.waitKey(1) & 0xFF == ord('q'):
          break


      #Code to constantly check the number of faces
      if i > 1:
          print('Multiple faces detected!')
          points += 100
          break

      if cv2.waitKey(1) & 0xFF == ord('w'):
          img_key = 'imgOnKey.png'
          cv2.imwrite(img_key, roi_gray)
          break


  if points:
    cap.release()
    cv2.destroyAllWindows()
    return points
  else: 
    cap.release()
    cv2.destroyAllWindows()
    return 'No points'
        

if __name__ == '__main__':
  app.run(debug=True)