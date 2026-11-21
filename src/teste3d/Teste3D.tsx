// TESTE DE VIABILIDADE (20/11): cenário 3D leve (Three.js) + personagem 2D (SVG) por cima.
// Objetivo: medir o tempo de renderização no PC do dono antes de decidir a arquitetura.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { EstiloB, PersonagemB } from "../personagemB/PersonagemB";
import { ELENCO_EXEMPLO } from "../personagemB/elencoB";

const Quarto: React.FC<{ t: number }> = ({ t }) => (
  <>
    <ambientLight intensity={0.35} color="#8a8cff" />
    <pointLight position={[1.6, 1.4, 0.6]} intensity={14} distance={7} color="#ffcf8a" castShadow />
    <directionalLight position={[-3, 3, 2]} intensity={0.6 + 0.3 * Math.sin(t * 2)} color="#9fb8ff" />
    {/* chão e paredes */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} /><meshStandardMaterial color="#6b4a3a" /></mesh>
    <mesh position={[0, 2, -2.5]} receiveShadow><planeGeometry args={[8, 4]} /><meshStandardMaterial color="#3d4f86" /></mesh>
    <mesh position={[-3, 2, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 4]} /><meshStandardMaterial color="#36477a" /></mesh>
    {/* janela com luz da lua */}
    <mesh position={[0.9, 2.1, -2.48]}><planeGeometry args={[1.3, 1.4]} /><meshStandardMaterial color="#1a2350" emissive="#2a3a8a" emissiveIntensity={0.8} /></mesh>
    {/* cama */}
    <mesh position={[-1.7, 0.3, -1.2]} castShadow><boxGeometry args={[1.6, 0.6, 2.2]} /><meshStandardMaterial color="#8a5a3c" /></mesh>
    <mesh position={[-1.7, 0.66, -1.2]} castShadow><boxGeometry args={[1.5, 0.15, 2.1]} /><meshStandardMaterial color="#e8eaf6" /></mesh>
    {/* criado-mudo + abajur */}
    <mesh position={[1.6, 0.35, -1.6]} castShadow><boxGeometry args={[0.7, 0.7, 0.6]} /><meshStandardMaterial color="#6e462e" /></mesh>
    <mesh position={[1.6, 1.0, -1.6]}><coneGeometry args={[0.3, 0.4, 24, 1, true]} /><meshStandardMaterial color="#ffd98a" emissive="#ffb84a" emissiveIntensity={1.2} side={THREE.DoubleSide} /></mesh>
    {/* estante */}
    <mesh position={[2.6, 1.2, -0.5]} castShadow><boxGeometry args={[0.5, 2.4, 1.6]} /><meshStandardMaterial color="#4a2a20" /></mesh>
  </>
);

const Camera: React.FC<{ t: number }> = ({ t }) => {
  // câmera de cinema: avança devagar e gira um pouco (dolly + pan)
  const cam = React.useRef<THREE.PerspectiveCamera>(null);
  React.useLayoutEffect(() => {
    if (!cam.current) return;
    cam.current.position.set(0.6 - t * 0.5, 1.5, 4.6 - t * 0.9);
    cam.current.lookAt(0, 1.0, -1);
    cam.current.updateProjectionMatrix();
  });
  return <perspectiveCamera ref={cam} args={[50, 1080 / 1920, 0.1, 50]} />;
};

export const Teste3D: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const escala = interpolate(f, [0, durationInFrames], [1, 1.18]); // personagem "chega mais perto" junto com a câmera
  return (
    <EstiloB.Provider value={{ contorno: true }}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <ThreeCanvas width={1080} height={1920} shadows camera={{ fov: 50, position: [0.6, 1.5, 4.6] }}>
          <Camera t={t} />
          <Quarto t={t} />
        </ThreeCanvas>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
          <g transform={`translate(540 1650) scale(${escala}) translate(-540 -1650)`}>
            <PersonagemB aparencia={ELENCO_EXEMPLO[3].ap} expressao="surpreso" acao="andar" x={500 + f * 2} y={1650} altura={760} />
          </g>
        </svg>
      </AbsoluteFill>
    </EstiloB.Provider>
  );
};
