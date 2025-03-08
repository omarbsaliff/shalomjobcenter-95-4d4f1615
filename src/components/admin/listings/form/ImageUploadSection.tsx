
import React, { useEffect, useCallback } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { ImageUploader } from '@/components/shared/image-uploader';
import { useUploadImage } from '@/hooks/upload';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

interface ImageUploadSectionProps {
  imagePreviews: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  error?: string;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviews,
  onImageChange,
  removeImage,
  error
}) => {
  const { toast } = useToast();
  const { handleSingleImageUpload } = useUploadImage({
    maxFileSize: 10,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  });

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const result = await handleSingleImageUpload(file);
      if (result) {
        const mockEvent = {
          target: {
            files: [result.compressedFile] as unknown as FileList
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onImageChange(mockEvent);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du traitement de l'image"
      });
    }
  }, [handleSingleImageUpload, onImageChange, toast]);

  const clearAllImages = () => {
    // Supprimer toutes les images une par une pour gérer correctement les blobs
    const totalImages = imagePreviews.length;
    for (let i = totalImages - 1; i >= 0; i--) {
      removeImage(i);
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem('latest_listing_images');
    localStorage.removeItem('latest_permanent_images');
    
    toast({
      title: "Images supprimées",
      description: "Toutes les images ont été supprimées"
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label 
          htmlFor="images" 
          className={`text-gray-700 font-medium ${error ? 'text-red-500' : ''}`}
        >
          Images {imagePreviews.length === 0 && '*'}
        </Label>
        
        {imagePreviews.length > 0 && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={clearAllImages}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Supprimer tout
          </Button>
        )}
      </div>
      
      <ImageUploader
        onImageUpload={handleImageUpload}
        variant="button"
        label="Sélectionner des images"
        buttonVariant="primary"
        allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
        maxSizeMB={10}
        className={error ? 'border border-red-500 rounded-md p-1' : ''}
      />
      
      {error ? (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      ) : (
        <p className="text-xs text-gray-500">
          Vous pouvez sélectionner plusieurs images. La première image sera utilisée comme aperçu.
        </p>
      )}

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-md border shadow-sm"
                loading="lazy"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                onClick={() => removeImage(index)}
                aria-label={`Supprimer l'image ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
