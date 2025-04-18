import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type props = {
    src:string,
    alt:string
}

const ImageThumbnail = ({ src, alt }:props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img
                    src={src}
                    alt={alt}
                    className="w-10 h-10 object-cover cursor-pointer rounded-full"
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{alt}</DialogTitle>
                    <DialogDescription>
                        {alt}
                    </DialogDescription>
                </DialogHeader>
                <img src={src} alt={alt} className="w-full h-auto" />
            </DialogContent>
        </Dialog>
    );
};

export default ImageThumbnail;