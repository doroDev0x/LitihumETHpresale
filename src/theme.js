import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          // Custom striped background with animation
          bgImage:
            "linear-gradient(45deg, #08FD19 25%, #03910D 25%, #03910D 50%, #08FD19 50%, #08FD19 75%, #03910D 75%)",
          backgroundSize: "1rem 1rem", // Adjust the size of the stripes
          animation: "stripe 1s linear infinite", // Stripe animation
        },
        track: {
          bg: "#292828", // Background color of the track
          boxShadow: "0px 0px 5px 2px #14F300E3", // Contour shadow for the filled area

        },
      },
    },
  },
  keyframes: {
    stripe: {
      "0%": {
        backgroundPosition: "0 0",
      },
      "100%": {
        backgroundPosition: "1rem 1rem", // Adjust this for the stripe movement
      },
    },
  },
});

export default theme;
