import { useEffect, useState } from 'react';
import { Navbar, Footer } from './components'
import { ClipsPage, AudioPage, EditClipPage } from './pages'
import { toast } from 'react-toastify';

import API from './api'
import { WebcamStream } from './components/stream';

function App() {
  const path = window.location.pathname;

  const [IsRecording, setIsRecording] = useState(false)
  const [RecordingColor, setRecordingColor] = useState('red');

  useEffect(function () {
    API.get('/').then(function ({ data }) {
      if (data.error) return;

      setIsRecording(data.isRecording);
    })
  }, [])

  useEffect(function () {
    if (!IsRecording) return;

    let color = 'red';

    setRecordingColor(color);

    setInterval(() => {
      if (color == 'red') {
        color = '#eee'
      } else {
        color = 'red'
      }

      setRecordingColor(color);
    }, 1000);
  }, [IsRecording])

  function toggleRecording() {
    let toastString = '';

    if (IsRecording) {
      // stop recording
      toastString = 'Recording Stopped.';
    } else {
      // start recording.
      toastString = 'Recording Started.';
    }

    API.get(IsRecording ? '/stop' : '/start').then(function (data) {
      if (data.status !== 200) return toast.error('Unexpected error.');

      (IsRecording ? toast.error : toast.success)(toastString, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setIsRecording(b => !b);
    });
  }

  return (
    path.startsWith('/clips') ? (
      path.startsWith('/clips/20') ?
        <EditClipPage />
        : <ClipsPage />
    ) : path.startsWith('/logs') ? (
      <div></div>
    ) : path.startsWith('/performance') ? (
      <div></div>
    ) : path.startsWith('/audio') ? (
      <AudioPage />
    ) : (
      <div>
        <Navbar />

        <div style={{ paddingTop: '45px', width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: `${1920 * 0.5}px`,
                height: `${1080 * 0.5}px`,
                backgroundColor: 'black',
                borderRadius: "8px",
                overflow: 'hidden',
              }}
            >
              {/* <WebcamStream /> */}

            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: "30px", paddingBottom: "0" }}>
            <div style={{ textAlign: 'center', marginRight: '30px', marginLeft: '30px' }}>
              <a
                href='#'
                style={{ color: IsRecording ? RecordingColor : '#eee' }}
                onClick={function (e) {
                  e.preventDefault()

                  toggleRecording();
                }}
              >
                <div style={{ height: "150px", width: "150px", backgroundColor: 'rgb(29, 36, 41)', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-video" style={{ fontSize: '65px' }}></i>
                </div>
              </a>

              <p style={{ color: 'white', padding: '15px', fontSize: "22px", fontWeight: '700' }}>Start/Stop</p>
            </div>

            <div style={{ marginRight: '30px' }}>
              <a href='/clips' style={{ color: 'black' }}>
                <div style={{ height: "150px", width: "150px", backgroundColor: 'rgb(29, 36, 41)', color: '#eee', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-photo-video" style={{ fontSize: '65px' }}></i>
                </div>
              </a>

              <p style={{ color: 'white', padding: '15px', fontSize: "22px", fontWeight: '700' }}>View Clips</p>
            </div>
          </div>



          {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginRight: '30px' }}>
              <a
                href='/audio'
                style={{ color: 'black' }}
              >
                <div style={{ height: "150px", width: "150px", backgroundColor: 'rgb(29, 36, 41)', color: '#eee', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-volume-up" style={{ fontSize: '65px' }}></i>
                </div>
              </a>

              <p style={{ color: 'white', padding: '15px', fontSize: "22px", fontWeight: '700' }}>Test Audio</p>
            </div>
          </div> */}
        </div>

        {/* <Footer /> */}
      </div>
    )
  );
}

export default App;
