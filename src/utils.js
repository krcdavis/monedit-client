import { useState } from "react";
import Axios from "axios";

export function getImg(spec) {
  const [im, setIm] = useState("");
  //no images are availabe yet, so use spec.default
  Axios.get("https://pokeapi.co/api/v2/pokemon/" + spec.default)
    .then((response) => {
      const res = response.data;
      console.log("ut", res.sprites.front_default);

      setIm(res.sprites.front_default);
    })
    .catch((e) => {
      console.log("handle error here: ", e.message);
    });
  return im; //i don't know how but I fixed it (':
}
