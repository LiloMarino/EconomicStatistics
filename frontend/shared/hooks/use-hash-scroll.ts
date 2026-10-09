import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Rola até o bloco que o hash da URL nomeia. A rolagem se refaz quando `key` muda: o
bloco de uma seção que espera a própria consulta só existe depois que ela chega. */
export function useHashScroll(key: unknown) {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, key]);
}
