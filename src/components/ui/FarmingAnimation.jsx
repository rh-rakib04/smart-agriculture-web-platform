import Lottie from "lottie-react";
import farmingAnimation from "../../../public/farming-animation.json";

function FarmingAnimation() {
  return (
    <div style={{ width: 350 }}>
      <Lottie animationData={farmingAnimation} loop={true} />
    </div>
  );
}

export default FarmingAnimation;
