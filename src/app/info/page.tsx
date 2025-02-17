"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

function Modal({treatment, onClose}) {
  return(
      <div onClick={onClose} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-xl font-bold mb-2 text-blue-300">{treatment.solution}</h1>
          <p className="text-gray-700 pb-3">{treatment.details}</p>
          
        </div>
      </div>
  )}

export default function InfoPage() {
  const [acneData, setacneData] = useState<any>(null);
  const [selectedTreatment,setSelectedTreatment] = useState(null)

  useEffect(() => {
    fetch("/skincare.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load JSON :(");
        }
        return res.json();
      })

      .then((json) => {
        console.log("got JSON", json);
        setacneData(json.acne_information);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, [])



  return (
    <div>
      <div className="flex flex-col items-center justify-start">

        <div className="w-full lg:w-2/5 gap-10 px-4 lg:px-0">
          
          <img src="/img2.jpg" alt="Info Image" className="pt-10 rounded-lg w-full" />

          <h1 className="text-2xl font-bold pt-6">Diagnosis: {acneData?.diagnosis.main_diagnosis || "..."}</h1>
          <h2 className="text-lg font-semibold pt-2"> Description:</h2>
          <p className="">{acneData?.diagnosis.description || "Loading..."}</p>
        </div>

        <h2 className="text-lg font-semibold py-3">Causes and solutions</h2>
        <div className="flex flex-row gap-2 lg:gap-4 max-w-full px-4 text-white">
          
          <div className="flex flex-col gap-2 items-start">
            {acneData?.causes?.map((cause: string, index: number) => (
              <div key={index} className="bg-red-500 p-4 rounded-lg text-center lg:w-64">
                <p className="font-bold">{cause}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 items-start">
            {acneData?.treatments?.map((treatment, index) => (
              <button key={index} onClick={() => setSelectedTreatment(treatment)} className="bg-green-500 p-4 rounded-lg text-center font-bold lg:w-64">
                {treatment.solution}
                
              </button>
            ))}

            {selectedTreatment && (
              <Modal treatment={selectedTreatment} onClose={() => setSelectedTreatment(null)} />
            )}

          </div>
        </div>
      </div>
    </div>

  );
}

