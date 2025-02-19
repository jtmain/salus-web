"use client";  

import React, { useRef, useEffect, useState } from "react";

const Page: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [jpgUrl, setJpgUrl] = useState<string>("");

  // Predefined images from the public folder for the picker.
  const imagePickerList = [
    "/image.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.png",
  ];

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

  // Existing function to capture a photo from the webcam.
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
            formData.append("image", blob, "photo.png");
            formData.append("skinfo", userInput);

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

  // Function to convert a JPG image (from the public folder) to a blob and upload it.
  const uploadImage = (imageUrl: string) => {
    const image = new Image();
    // Allow cross-origin image loading if needed.
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      const ctx = tempCanvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(image, 0, 0, image.width, image.height);
        tempCanvas.toBlob((blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("image", blob, "photo.png");
            formData.append("skinfo", userInput);

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
    };

    image.onerror = () => {
      console.error("Failed to load image from URL:", imageUrl);
    };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-6">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        className="w-4/5 rounded-lg resize-none"
      ></video>
      
      <button
        onClick={capturePhoto}
        className="resize-none font-bold mt-4 p-3 bg-blue-300 text-stone-50 rounded-lg"
      >
        Start scan!
      </button>
      
      <textarea
        placeholder="Add any extra information on your skin (e.g., skin type, allergies, itchiness)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="mt-4 p-2 border border-stone-600 text-stone-400 rounded-lg w-4/5 h-64 resize-none focus:border-black"
      ></textarea>
    
      {/* Image Picker: horizontally scrollable container with 5 images from public folder */}
      <div className="px-4">
        <div className="w-full overflow-x-auto pt-12">
          <div className="flex space-x-4">
            {imagePickerList.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Picker image ${index + 1}`}
                className="w-32 h-32 object-cover cursor-pointer rounded-lg border border-stone-600"
                onClick={() => uploadImage(url)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
