import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRate from "./StarRate";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRate onSetRating={setMovieRating} />
//       <p>
//         This movie was rated <b>{movieRating}</b> stars
//       </p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRate
      maxRating={5}
      message={["terrible", "bad", "okay", "good", "amazing"]}
    />
    <StarRate maxRating={10} color="red" defaultRating={3} />
    <Test /> */}

    {/* <StarRate /> */}
  </React.StrictMode>
);
