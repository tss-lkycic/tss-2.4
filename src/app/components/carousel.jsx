"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import Image from "next/image";

const Carousel = ({ images, image_labels, image_description }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  function toggleMore() {
    if (showMore === true) {
      setShowMore(false);
    } else setShowMore(true);
  }
  return (
    <div className="w-full mt-[1rem]">
      <div className="w-full flex justify-between px-5 h-[10rem]">
        <Image
          key={currentIndex === 0 ? images.length - 1 : currentIndex - 1}
          src={
            images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]
          }
          width={70}
          height={70}
          alt="tss logo tool"
          className="opacity-50 "
        />
        <Image
          key={currentIndex}
          src={images[currentIndex]}
          width={100}
          height={100}
          alt="tss logo tool"
        />
        <Image
          key={(currentIndex + 1) % images.length}
          src={images[(currentIndex + 1) % images.length]}
          // src={test}
          width={70}
          height={70}
          alt="tss logo tool"
          className="opacity-50 "
        />
      </div>
      <div className="w-full flex flex-row mt-[1rem]">
        <div className="w-1/12 flex justify-start">
          <div
            className="w-[1.5rem] h-[1.5rem] text-[#474545]  bg-[#908F8F] rounded-full flex justify-center items-center"
            onClick={handlePrevious}
          >
            <FiChevronLeft />
          </div>
        </div>
        <div className="w-10/12 flex flex-col justify-center">
          <p>{image_labels[currentIndex]}</p>
          <p className="text-xs">{image_description[currentIndex]}</p>

          <button onClick={toggleMore} className="border rounded-2xl mt-[1rem]">
            {" "}
            <a href="https://www.youtube.com/watch?v=UJGSxmVm-L8">
              Find out more{" "}
            </a>
          </button>
        </div>
        <div className="w-1/12 flex justify-end ">
          <div
            className="w-[1.5rem] h-[1.5rem]  bg-[#908F8F] text-[#474545] rounded-full flex justify-center items-center"
            onClick={handleNext}
          >
            <FiChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
