"use client";

import { useState } from "react";
// import Image from "next/image";
import ImageUpload from "@/components/image-upload";
import ImageProcessor from "@/components/image-processor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setProcessedImage(null);
  };

  const handleImageProcess = (processedImageDataUrl: string) => {
    setProcessedImage(processedImageDataUrl);
    console.log("processedImage", processedImage);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Image Processor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload onImageUpload={handleImageUpload} />
          {uploadedImage && (
            <ImageProcessor
              imageUrl={uploadedImage}
              onImageProcess={handleImageProcess}
            />
          )}
          {/* {processedImage && (
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={processedImage}
                alt="Processed"
                width={500}
                height={300}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          )} */}
        </CardContent>
      </Card>
    </main>
  );
}
