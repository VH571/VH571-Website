"use client";
import "@/styles/bootstrap-carousel.scss";
import { Box, Image } from "@chakra-ui/react";
import Carousel from "react-bootstrap/Carousel";
import { ImageURL } from "@/models/project";

export function ImageCarousel({
  name,
  screenshots,
}: {
  name: string;
  screenshots: ImageURL[];
}) {
  if (!Array.isArray(screenshots) || screenshots.length === 0) return null;

  return (
    <Box borderRadius="xl" overflow="hidden" bg="white">
      <Carousel
        interval={null}
        fade={false}
        indicators
        prevLabel={null}
        nextLabel={null}
      >
        {screenshots.map((img, i) => (
          <Carousel.Item key={`${img.url}-${i}`}>
            <Image
              src={
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?..."
              }
              alt={img.alt ?? `${name} screenshot ${i + 1}`}
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
              decoding="async"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </Box>
  );
}
