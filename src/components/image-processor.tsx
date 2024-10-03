import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import cv from "@techstark/opencv-js";

interface ImageProcessorProps {
  imageUrl: string;
  onImageProcess: (processedImageDataUrl: string) => void;
}

export default function ImageProcessor({
  imageUrl,
  onImageProcess,
}: ImageProcessorProps) {
  const [brightness, setBrightness] = useState(0);
  const [cropSize, setCropSize] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadOpenCV = async () => {
      if (typeof cv === "undefined") {
        await import("@techstark/opencv-js");
      }
    };
    loadOpenCV();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      processImage();
    };
    img.src = imageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const processImage = useCallback(() => {
    setIsProcessing(true);
    if (
      !canvasRef.current ||
      !originalImageRef.current ||
      typeof cv === "undefined"
    )
      return;

    const src = cv.imread(originalImageRef.current);

    // Apply brightness adjustment
    const brightnessMat = new cv.Mat();
    src.convertTo(brightnessMat, -1, 1, brightness);

    // Apply crop
    const centerX = src.cols / 2;
    const centerY = src.rows / 2;
    const cropPercentage = cropSize / 100;
    const cropWidth = src.cols * cropPercentage;
    const cropHeight = src.rows * cropPercentage;
    const rect = new cv.Rect(
      centerX - cropWidth / 2,
      centerY - cropHeight / 2,
      cropWidth,
      cropHeight
    );
    const croppedMat = brightnessMat.roi(rect);

    cv.imshow(canvasRef.current, croppedMat);
    const processedImageDataUrl = canvasRef.current.toDataURL(
      "image/jpeg",
      0.8
    );
    onImageProcess(processedImageDataUrl);

    src.delete();
    brightnessMat.delete();
    croppedMat.delete();
    setIsProcessing(false);
  }, [brightness, cropSize, onImageProcess]);

  useEffect(() => {
    processImage();
  }, [brightness, cropSize, processImage]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/jpeg", 0.8);
      link.download = "processed_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Brightness</Label>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
        />
      </div>
      <div className="space-y-2">
        <Label>Crop Size (%)</Label>
        <Slider
          min={10}
          max={100}
          step={1}
          value={[cropSize]}
          onValueChange={(value) => setCropSize(value[0])}
        />
      </div>
      <Button onClick={handleDownload} disabled={isProcessing}>
        Download Processed Image
      </Button>
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
}
