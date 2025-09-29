import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

type BoxProps = JSX.IntrinsicElements["mesh"] & {
  rotationSpeed?: number;
};

const Box = ({ rotationSpeed = 0.01, ...props }: BoxProps) => {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed;
      mesh.current.rotation.y += rotationSpeed / 2;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

export default Box;
