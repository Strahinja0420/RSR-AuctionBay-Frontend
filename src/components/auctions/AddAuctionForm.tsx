import React, { Activity, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function AddAuctionForm({ isOpen, onClose }: Props) {
  return (
    <>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="bg-white z-10">
            <button className="text-9xl text-black" onClick={onClose}>Close</button>
          </div>
        </div>
      </Activity>
    </>
  );
}

export default AddAuctionForm;
