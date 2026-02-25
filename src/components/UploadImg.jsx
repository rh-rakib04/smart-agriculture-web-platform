"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Button from "./ui/Button";

const UploadImg = ({onUpload}) => {
    const [publicId, setPublicId] = useState("");
  return (
    <CldUploadWidget uploadPreset="smartAgri"  onSuccess={(result) => {
        const imageUrl = result.info.secure_url;
        onUpload(imageUrl);
      }}>
        {/* onSuccess={({event, info})=>{
        if(event === "success"){
            setPublicId(info?.public_id);
        }
    }} */}
      {({ open }) => (
        <Button
          onClick={() => open()}
          variant="outline"
        >
          Upload Image
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadImg;