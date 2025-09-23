"use client";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Bounds, Center, Html, OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import { Center as CenterL, Spinner, VStack, Text } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Props = {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  height?: string | number;
};
function Loading() {
  return (
    <Provider>
      <CenterL h="100%" w="100%">
        <VStack>
          <Spinner size="xl" borderWidth="4px" />
          <Text color="gray.500">Loading…</Text>
        </VStack>
      </CenterL>
    </Provider>
  );
}
function MeshComponent({ fileUrl }: { fileUrl: string }) {
  const mesh = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);
  // useFrame(() => {
  //     mesh.current.rotation.x += 0.01;
  //     mesh.current.rotation.y += 0.01;
  // });
  return (
    <mesh ref={mesh}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export default function ModelViewer({ modelPath }: Props) {
  return (
    <Canvas>
      <Suspense
        fallback={
          <Html center>
            <Loading />
          </Html>
        }
      >
        <axesHelper />
        <ambientLight intensity={0.5} />
        <color attach="background" args={["#252530"]} />
        <directionalLight position={[10, 10, 10]} color={"white"} />
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={true}
          zoomSpeed={0.3}
        />
        <gridHelper
          args={[10, 10, "#151515", "#020202"]}
          position={[0, -1, 0]}
        />

        <Bounds fit clip observe>
          <Center>
            <MeshComponent fileUrl={modelPath} />
          </Center>
        </Bounds>
      </Suspense>
    </Canvas>
  );
}
