import { motion } from 'framer-motion-3d';
import { MotionConfig } from 'framer-motion';
import { useRef, useLayoutEffect } from 'react';
import { transition } from './settings';
import { Canvas, useThree } from '@react-three/fiber';
import { useSmoothTransform } from './useSmoothTransform';
import { useGLTF } from '@react-three/drei';

// @ts-ignore
export function Shapes({ isHover, isPress, mouseX, mouseY }) {
  const lightRotateX = useSmoothTransform(mouseY, spring, mouseToLightRotation);
  const lightRotateY = useSmoothTransform(mouseX, spring, mouseToLightRotation);

  return (
    <Canvas shadows dpr={[1, 2]} resize={{ scroll: false, offsetSize: true }}>
      <Camera mouseX={mouseX} mouseY={mouseY} />
      <MotionConfig transition={transition}>
        <motion.group
          center={[0, 0, 0]}
          rotation={[lightRotateX, lightRotateY, 0]}
        >
          <Lights />
        </motion.group>
        <motion.group
          initial={false}
          animate={isHover ? 'hover' : 'rest'}
          dispose={null}
          variants={{
            hover: {
              z: isPress ? -0.9 : 0
            }
          }}
        >
          <Craft />
          <Laptop />
          <ComputerScreen />
        </motion.group>
      </MotionConfig>
    </Canvas>
  );
}

export function Lights() {
  return (
    <>
      <spotLight color="#61dafb" position={[-10, -10, -10]} intensity={0.2} />
      <spotLight color="#61dafb" position={[-10, 0, 15]} intensity={0.8} />
      <spotLight color="#61dafb" position={[-5, 20, 2]} intensity={0.5} />
      <spotLight color="#9effc8" position={[15, 10, -2]} intensity={2} />
      <spotLight color="#9effc8" position={[15, 10, 5]} intensity={1} />
      <spotLight color="#88ffb8" position={[5, -10, 5]} intensity={0.8} />
    </>
  );
}

export function Craft() {
  // @ts-ignore
  const { nodes, materials } = useGLTF('/craft_speederA.glb');

  return (
    <motion.mesh
      position={[1.1, 0, 0]}
      variants={{
        hover: {
          y: -2,
          z: -0.1,
          x: 0.1,
          rotateY: -2.2,
          rotateX: 0.5,
          rotateZ: -0.1
        }
      }}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_craft_speederA.geometry}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_craft_speederA_1.geometry}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_craft_speederA_2.geometry}
          material={materials.dark}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_craft_speederA_3.geometry}
          material={materials.metalDark}
        />
        <Material />
      </group>
    </motion.mesh>
  );
}

export function Laptop() {
  // @ts-ignore
  const { nodes, materials } = useGLTF('/laptop.glb');

  return (
    <motion.mesh
      position={[-0.8, 0.4, 0]}
      rotation={[-0.5, 1, -0.3]}
      variants={{
        hover: {
          z: 2.2,
          x: -1,
          y: 0.1,
          rotateX: 1,
          rotateZ: 0.3,
          rotateY: 0.1
        }
      }}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_laptop.geometry}
          material={materials.metalDark}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_laptop_1.geometry}
          material={materials.metal}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_laptop_2.geometry}
          material={materials.metalMedium}
        />
      </group>
    </motion.mesh>
  );
}

export function ComputerScreen() {
  // @ts-ignore
  const { nodes, materials } = useGLTF('/computerScreen.glb');

  return (
    <motion.mesh
      position={[1, -1, 0]}
      rotation-z={0.5}
      variants={{
        hover: {
          x: 0.3,
          z: 3.1,
          y: -0,
          rotateZ: 0,
          rotateY: -0.3,
          rotateX: 0
        }
      }}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_computerScreen.geometry}
          material={materials.metalDark}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_computerScreen_1.geometry}
          material={materials.metal}
        />
      </group>
    </motion.mesh>
  );
}

export function Material() {
  return <meshPhongMaterial color="#fff" specular="#61dafb" shininess={10} />;
}

// Adapted from https://github.com/pmndrs/drei/blob/master/src/core/PerspectiveCamera.tsx
// @ts-ignore
function Camera({ mouseX, mouseY, ...props }) {
  const cameraX = useSmoothTransform(mouseX, spring, (x: number) => x / 350);
  const cameraY = useSmoothTransform(
    mouseY,
    spring,
    (y: number) => (-1 * y) / 350
  );

  const set = useThree(({ set }: any) => set);
  const camera = useThree(({ camera }: any) => camera);
  const size = useThree(({ size }: any) => size);
  const scene = useThree(({ scene }: any) => scene);
  const cameraRef = useRef();

  useLayoutEffect(() => {
    const { current: cam } = cameraRef;
    if (cam) {
      // @ts-ignore
      cam.aspect = size.width / size.height;
      // @ts-ignore
      cam.updateProjectionMatrix();
    }
  }, [size, props]);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      const oldCam = camera;
      set(() => ({ camera: cameraRef.current }));
      return () => set(() => ({ camera: oldCam }));
    }
  }, [camera, cameraRef, set]);

  useLayoutEffect(() => {
    return cameraX.onChange(() => camera.lookAt(scene.position));
  }, [cameraX]); // eslint-disable-line react-hooks/exhaustive-deps

  // @ts-ignore
  return (
    <motion.perspectiveCamera
      ref={cameraRef as any}
      fov={90}
      position={[cameraX, cameraY, 3.8]}
    />
  );
}

const spring = { stiffness: 600, damping: 30 };

const mouseToLightRotation = (v: number) => (-1 * v) / 140;
