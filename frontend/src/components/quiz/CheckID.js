import React, { Fragment, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Helmet } from "react-helmet";
import { Link as RouteLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CameraAlt from "@material-ui/icons/CameraAlt";
import ReplayIcon from "@material-ui/icons/Replay";
import axios from "axios";
import Default from "../Default";
const API = process.env.REACT_APP_API_BASEURL;
const FLASK_API_PHOTO = "http://localhost:5000/photo";

const config = {
  baseURL: `${API}`,
  withCredentials: true,
};

function CheckID() {
  const [webc, setWebc] = useState(true);
  const [next, setNext] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const TakePhoto = async () => {
    setWebc(!webc);
    try {
      setLoading(!loading);
      const response = await axios.get(`${FLASK_API_PHOTO}`);
      console.log(response.status);
      setLoading(false);
      setConfirmation(!confirmation);
    } catch (error) {
      console.log(error);
    }
    setNext(!next);
  };
  const ResetPhoto = () => {
    setWebc(!webc);
    window.location.reload(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await axios.get(`/status`, config);
        if (response.status === 200) {
          setUser(true);
        } else if (response.status === 401) {
          setUser(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();

    let recorder, stream;
    function downloadFile(blob, filename) {
      const url = window.URL.createObjectURL(blob);
      console.log(url);
    }

    async function startRecording() {
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
        });
        recorder = new MediaRecorder(stream);

        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = (e) => {
          const completeBlob = new Blob(chunks, { type: "video/mp4;" });
          downloadFile(completeBlob, "Video.mp4");
          console.log(completeBlob);
        };

        recorder.start();
      } catch (error) {
        console.log(error);
      }
    }
    startRecording();

    return () => checkAuth();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Check ID</title>
      </Helmet>
      {user ? (
        <div className="instructions container">
          <h1>Check your ID</h1>
          <br />
          <div className="camera">
            {webc ? <Webcam width="400px" /> : null}
            {confirmation ? (
              <div>
                <h1>ID recognized</h1>
                <h1>You have succesfully taken a photo, please continue</h1>
              </div>
            ) : null}
            {loading ? <h1>Loading...Please keep the ID on camera</h1> : null}
            <br />
            <br />
            {webc ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<CameraAlt />}
                onClick={TakePhoto}
              >
                Take photo
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<ReplayIcon />}
                onClick={ResetPhoto}
              >
                I want to retake the photo
              </Button>
            )}
          </div>
          <br />
          <br />
          <br />
          <div>
            <span className="left">
              <RouteLink to="/">Go back to the Home Page</RouteLink>
            </span>

            <span className="right">
              {next ? (
                <RouteLink to="/play/quiz">Start Exam</RouteLink>
              ) : (
                <p>Take a photo first</p>
              )}
            </span>
          </div>
        </div>
      ) : (
        <Default />
      )}
    </Fragment>
  );
}

export default CheckID;
