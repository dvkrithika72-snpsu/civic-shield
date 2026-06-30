import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export const useImageValidator = () => {
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (e) {
        console.error("Failed to load COCO-SSD model", e);
      } finally {
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const validateImage = async (imgElement) => {
    if (!model) return { isValid: true, labels: [] }; // Fallback if model fails

    try {
      const predictions = await model.detect(imgElement);
      const labels = predictions.map(p => p.class);
      
      // Civic-relevant tags from COCO-SSD's 80 classes
      const relevantClasses = [
        'car', 'truck', 'bus', 'train', 'motorcycle', 'bicycle', 
        'stop sign', 'parking meter', 'bench', 'fire hydrant', 'potted plant'
      ];
      
      const relevantLabels = labels.filter(label => relevantClasses.includes(label));
      
      // Block if it confidently detected objects, but NONE are civic-relevant (e.g. only pizza, person, dog)
      // If it detected nothing (e.g. a plain pothole or generic trash), we allow it as a fallback.
      const isBlocked = predictions.length > 0 && relevantLabels.length === 0;

      return {
        isValid: !isBlocked,
        labels: labels,
        relevantLabels
      };
    } catch (e) {
      console.error("Error during image validation", e);
      return { isValid: true, labels: [] };
    }
  };

  return { validateImage, isModelLoading };
};
