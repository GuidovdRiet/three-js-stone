import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";

// Styles
import "./styles.css";

extend({ OrbitControls });

const SpaceShip = () => {
  const [model, setModel] = useState();

  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel);
  });

  return (
    <mesh position={[0, -8, 0]}>
      {model ? <primitive object={model.scene} /> : null}
    </mesh>
  );
};

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    orbitRef.current.update();
  });

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshPhysicalMaterial attach="material" color="black" />
    </mesh>
  );
};

const Box = () => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const props = useSpring({
    scale: active ? [2, 0.7, 1.5] : [1, 1, 1],
    color: hovered ? "hotpink" : "gray"
  });

  //   // Everything in here is executed in every frame (60 fps)
  // useFrame(() => {
  //   meshRef.current.rotation.y += 0.01;
  // });

  return (
    <a.mesh
      // Has properties position, scale, rotation to animate
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <a.meshPhysicalMaterial attach="material" color={props.color} />
    </a.mesh>
  );
};

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 2, 10] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <fog attach="fog" args={["black", 11, 15]} />
      <ambientLight intensity={0.2} />
      <spotLight position={[15, 20, 400]} penumbra={1} castShadow />
      <Controls />
      {/* <Box /> */}
      {/* <Plane /> */}
      <SpaceShip />
    </Canvas>
  );
}
