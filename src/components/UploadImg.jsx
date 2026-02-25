"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Button from "./ui/Button";

const UploadImg = () => {
    const [publicId, setPublicId] = useState("");
  return (
    <CldUploadWidget uploadPreset="smartAgri" >
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