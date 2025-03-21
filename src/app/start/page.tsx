"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Predefined images from the public folder for the picker.
  const imagePickerList = [
    "/Img5.png",
    "/IMG10.png",
    "/IMG7.png",
    "/IMG8.png",
    "/IMG9.png",
    "/IMG11.png",
    "IMG13.jpg",
    "IMG14.jpg"
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

  // Capture a photo from the webcam and upload it.
  const capturePhoto = () => {
    if (videoRef.current) {
      setIsLoading(true); // Start loading
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

            fetch("https://salus-be-834299777702.us-central1.run.app/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                setIsLoading(false);
                // Store the data in sessionStorage before navigation
                console.log("data", data);
                sessionStorage.setItem('skinAnalysisData', JSON.stringify(data));
                const storedData = sessionStorage.getItem('skinAnalysisData');
                console.log("storedData", storedData);
                router.push('/info');
              })
              .catch((error) => {
                setIsLoading(false); // Stop loading on error
                console.error("Error uploading image:", error);
              });
          }
        }, "image/png");
      }
    }
  };

  // Convert a JPG image to a blob and upload it.
  const uploadImage = (imageUrl: string) => {
    setIsLoading(true); // Start loading
    const image = new Image();
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

            fetch("https://salus-be-834299777702.us-central1.run.app/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                setIsLoading(false);
                // Store the data in sessionStorage before navigation
                console.log("data", data);
                sessionStorage.setItem('skinAnalysisData', JSON.stringify(data));
                const storedData = sessionStorage.getItem('skinAnalysisData');
                console.log("storedData", storedData);
                router.push('/info');
              })
              .catch((error) => {
                setIsLoading(false); // Stop loading on error
                console.error("Error uploading image:", error);
              });
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mb-4"></div>
            <p className="text-gray-700">Processing your image, this may take a while...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-4/5 rounded-lg resize-none"
      ></video>
      
      <button
        onClick={capturePhoto}
        className="resize-none font-bold mt-4 p-3 bg-sky-400 text-stone-50 rounded-lg"
      >
        Start scan!
      </button>
      
      <textarea
        placeholder="Add any extra information on your skin (e.g., skin type, allergies, itchiness)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="mt-4 p-2 border border-stone-600 text-stone-400 rounded-lg w-4/5 h-64 resize-none focus:border-black"
      ></textarea>
    
      {/* Image Picker */}
      <div className="px-4">
        <div className="w-full overflow-x-auto pt-12">
          <div className="flex space-x-4">
            {imagePickerList.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Picker image ${index + 1}`}
                className="w-32 h-32 object-cover cursor-pointer rounded-lg"
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
