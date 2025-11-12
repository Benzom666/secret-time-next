import React from "react";
import Image from "next/image";
import logoGif from "../../assets/logo.gif";

function Loader() {
  return (
    <div className="page-loading-logo">
      <Image
        src={logoGif}
        alt="loading..."
        className=""
        width={200}
        height={200}
        unoptimized
        priority
      />
    </div>
  );
}

export default Loader;
