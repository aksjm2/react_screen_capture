import React, {useEffect, useRef, useState} from 'react';
import Painterro from 'painterro';

export const ScreenView = () => {
    const [stream, setStream] = useState();

    const [isCaptured, setIsCaptured] = useState(false);
    const [dataUrl, setDataUrl] = useState("");

    const videoRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (dataUrl !== "") {
            window.ptro = Painterro({
                id: 'painterro',
                saveHandler: (image, done) => {
                    imgRef.current.src = image.asDataURL();
                    done(true);
                }
            }).show(dataUrl);
        }
    },[dataUrl])

    async function getDisplayMedia() {
        const constraints = {
            video: true,
            audio: false,
        };

        return await navigator.mediaDevices.getDisplayMedia(constraints)
        .then(stream => {
            videoRef.current.srcObject = stream;
            setStream(stream);
        }).catch(err => {
            console.error(`ERROR : ${err}`);
        });
    }

    async function playStreamData() {
        return await videoRef.current.play();
    }

    function stopStreamData() {
        videoRef.current.pause();
    }

    async function captureScreen() {
        setDataUrl("");
        await getDisplayMedia();
        await playStreamData();

        videoRef.current.pause();

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.width;
        canvas.height = videoRef.current.height;

        const context = canvas.getContext('2d');
        if(context != null) {
            context.drawImage(videoRef.current, 0, 0, 640, 480);
        }

        const t_dataUrl = canvas.toDataURL('image/png');

        setStream(null);
        setDataUrl(t_dataUrl);
        
        return t_dataUrl;
    }


    return (
        <div>
            <div>
                <video ref={videoRef} width={'640px'} height={'480px'} style={{display: 'none'}}></video>
                <p>
                    {dataUrl}
                </p>
                <button onClick={captureScreen}>캡처</button>
                <img ref={imgRef}></img>
            </div>
            <div id="painterro" style={{width:"640px", height:"480px", position: "relative", overflow: "hidden"}}></div>
        </div>
    );

}