import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CreateCampaignImage() {
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false); // New state to toggle cropper
  const navigate = useNavigate();

  const getCroppedImg = async (imageSrc: string, crop: any) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob!));
      }, "image/jpeg");
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true); // Show the cropper when a new file is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_croppedAreaPercentage: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (imageSrc && croppedArea) {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      setCampaignImage(croppedImage); // Save the cropped image
      setShowCropper(false); // Hide the cropper after saving
    }
  };

  const handleReupload = () => {
    setImageSrc(null); // Clear the current image
    setCampaignImage(null); // Clear the cropped image
    setCroppedArea(null); // Reset cropping area
    setShowCropper(false); // Reset cropper visibility
  };

  const handleEditCrop = () => {
    setCampaignImage(null); 
    setShowCropper(true); // Show the cropper again for editing
  };

  return (
    <div className="relative">
      <div className="flex w-full" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="left flex flex-col items-center justify-center space-y-4">
          <h1 className="text-1xl">3 of 4</h1>
          <h1 className="text-5xl font-bold text-center">Add Media</h1>
          <p className="text-gray-400 text-center">
            A strong, high-quality image creates a connection and makes your page more visually appealing.
          </p>
        </div>
        <div className="right flex flex-col h-full w-full">
          <div className="flex flex-col space-y-4 w-4/5 mx-auto mt-auto">
            <h1 className="font-bold">Upload A Cover Image:</h1>
            {!imageSrc && !campaignImage ? (
              <div
                className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <span className="text-gray-400 text-xl">+</span>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                {showCropper ? (
                  <div className="relative w-full h-64">
                    <div className="relative w-full h-64">
                    <Cropper
                      image={imageSrc || undefined}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button onClick={handleReupload}>Reupload</Button>
                      <Button onClick={handleCrop}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={campaignImage as string}
                      alt="Cropped"
                      className="w-full h-64 object-cover rounded-md"
                    />
                    <div className="flex justify-between mt-4">
                      <Button onClick={handleReupload}>Reupload</Button>
                      <Button onClick={handleEditCrop}>Edit Crop</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Buttons at the bottom */}
          <div className="flex flex-col w-full px-4 mt-auto">
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
                style={{ width: "75%" }} // Adjust width based on the current step
              ></div>
            </div>
          </div>
          <div className="flex justify-end justify-between w-full">
            <Button className="self-start" onClick={() => navigate("/description")}>
              Back
            </Button>
            <Button
              className="self-end"
              onClick={() => navigate("/wallet")}
              disabled={!campaignImage}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}