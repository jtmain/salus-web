"use client";  

import React, { useRef, useEffect, useState } from "react";

const Page: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam: ", error);
      });
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
  
      const tempCanvas = document.createElement("canvas");
      const context = tempCanvas.getContext("2d");
  
      if (context) {
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        tempCanvas.toBlob((blob) => {
          if (blob) {
          
            const formData = new FormData();
            formData.append("image", blob, "photo.png")
            formData.append("skinfo", userInput)

            fetch("http://127.0.0.1:8000/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => console.log("Upload success:", data))
              .catch((error) => console.error("Error uploading image:", error));
          }
        }, "image/png");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-6">

          <video ref={videoRef} autoPlay loop muted className="w-4/5 rounded-lg resize-none">
          </video>

          <button onClick={capturePhoto} className="resize-none font-bold mt-4 p-3 bg-blue-300 text-stone-50 rounded-lg">
            Start scan!
          </button>
          
          <textarea placeholder="Add any extra information on your skin (i.e skin type, allergies, itchiness)" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="mt-4 p-2 border border-stone-600 text-stone-400 rounded-lg w-4/5 h-20 resize-none focus:border-black"></textarea>
          <canvas ref={canvasRef} className="w-4.5/5 mt-4 rounded-lg"></canvas>
    </div>
  );
};

export default Page;
