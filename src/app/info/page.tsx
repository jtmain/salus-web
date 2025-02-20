"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AcneInformation, Root } from '../types/types';
import { Suspense } from "react";

type Treatment = {
  solution: string;
  details: string;
};

interface ModalProps {
  treatment: Treatment;
  onClose: () => void;
}

function Modal({treatment, onClose}: ModalProps) {
  return(
      <div onClick={onClose} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-xl font-bold mb-2 text-blue-300">{treatment.solution}</h1>
          <p className="text-gray-700 pb-3">{treatment.details}</p>
          
        </div>
      </div>
  )}

// Update the type for the stored data
type StoredData = {
  message: string;
  acne_counts: string;
  ai_response: string; // JSON string that parses to AcneInformation
  response_image: string;
};

export default function InfoPage() {
  const [data, setData] = useState<StoredData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('skinAnalysisData');
    if (storedData) {
      setData(JSON.parse(storedData));
      // Optionally clear the data after retrieving
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoContent data={data} />
    </Suspense>
  );
}

function InfoContent({ data }: { data: StoredData | null }) {
  const [acneData, setacneData] = useState<AcneInformation | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [products, setProducts] = useState<Treatment[]>([]);
  const [responseImage, setResponseImage] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  useEffect(() => {
    if (data?.ai_response) {
      try {
        const cleanJsonString = data.ai_response
          .replace(/^```json\n/, '')
          .replace(/\n```$/, '')
          .trim();

        const acneInformation = JSON.parse(cleanJsonString);
        console.log("acneInformation", acneInformation);
        setacneData(acneInformation.acne_information);

        if (acneInformation.acne_information.routine) {
          const allProducts = [
            ...acneInformation.acne_information.routine.section_one,
            ...acneInformation.acne_information.routine.section_two,
            ...acneInformation.acne_information.routine.section_three
          ].map(item => ({
            solution: item.product,
            details: item.benefit
          }));
          setProducts(allProducts);
        }
        
        if (data.response_image) {
          setResponseImage(data.response_image);
        }
      } catch (error) {
        console.error("Failed to parse acne information:", error);
        console.log("Raw data:", data.ai_response);
        loadFallbackData();
      }
    } else {
      if (acneData === null) {
        loadFallbackData();
      }
    }
  }, [data]);
  useEffect(() => {
    console.log("Updated acneData:", acneData);
}, [acneData]);

  const loadFallbackData = () => {
    fetch("/skincare.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load JSON :(");
        }
        return res.json();
      })
      .then((json: Root) => {
        console.log("got JSON", json);
        setacneData(json.acne_information);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  };

  const toggleProduct = (index: number) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-start">

        <div className="w-full lg:w-2/5 gap-10 px-4 lg:px-0">
          
          {responseImage ? (
            <img 
              src={`data:image/jpeg;base64,${responseImage}`} 
              alt="Analyzed Image" 
              className="pt-10 rounded-lg w-full"
            />
          ) : (
            <img 
              src="/img4.jpg" 
              alt="Info Image" 
              className="pt-10 rounded-lg w-full" 
            />
          )}

          <h1 className="text-2xl font-bold pt-6">Diagnosis: {acneData?.diagnosis.main_diagnosis || "..."}</h1>
          <h2 className="text-lg font-semibold pt-2"> Description:</h2>
          <p className="">{acneData?.diagnosis.description || "Loading..."}</p>
        </div>

        <h2 className="text-lg font-semibold py-3">Causes and solutions</h2>
        <div className="flex flex-row gap-2 lg:gap-4 max-w-full px-4 text-white">
          <div className="grid grid-cols-1 gap-2 w-full">
            {acneData?.causes?.map((cause: string, index: number) => (
              <div key={index} className="bg-red-500 p-4 rounded-lg text-center h-full flex items-center justify-center">
                <p className="font-bold">{cause}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {acneData?.treatments?.map((treatment, index) => (
              <button 
                key={index} 
                onClick={() => setSelectedTreatment(treatment)} 
                className="bg-green-500 p-4 rounded-lg text-center font-bold h-full flex items-center justify-center"
              >
                {treatment.solution}
              </button>
            ))}
            
            {selectedTreatment && (
              <Modal treatment={selectedTreatment} onClose={() => setSelectedTreatment(null)} />
            )}
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pt-12">Products & Treatments</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No treatments available.</p>
          ) : (
            <div className="space-y-2">
              {products.map((treatment, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleProduct(index)}
                    className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span className="text-lg font-semibold text-gray-900">{treatment.solution}</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        expandedProduct === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedProduct === index && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <p className="text-gray-600">{treatment.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pb-10">
          <a 
            href="/"
            className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Analyze Another Image
          </a>
        </div>
      </div>
    </div>

  );
}

