import Link from "next/link";
export default function Tablet1() {
  return (
    <nav
      {...{
        className:
          "framer-UZyYA framer-Huv4P framer-xuZuY framer-183p5qo framer-v-1omrk0a",
        "data-framer-name": "Tablet ",
        style: {
          backgroundColor:
            "var(--token-ef5f21cb-c880-4c9e-b366-3fc1205e6d9b, rgb(242, 244, 246))",
          width: "100%",
        },
      }}
    >
      <div
        {...{
          className: "framer-1jhwrsn",
          "data-framer-name": "Wrap",
          style: { backgroundColor: "rgba(0, 0, 0, 0)" },
        }}
      >
        <div
          {...{
            className: "framer-ec2xr0",
            "data-framer-name": "Tablet/mobile Close",
          }}
        >
          <div {...{ className: "framer-1jp22fz-container" }}>
            <Link
              prefetch={false}
              {...{
                className:
                  "framer-dA0di framer-7FyOX framer-kb4gkn framer-v-kb4gkn framer-154rmdi",
                "data-framer-name": "Dark",
                href: "/",
              }}
            >
              <div
                {...{ className: "framer-jvjaub", "data-framer-name": "Image" }}
              >
                <div
                  {...{
                    style: {
                      position: "absolute",
                      borderRadius: "inherit",
                      cornerShape: "inherit",
                      top: "0",
                      right: "0",
                      bottom: "0",
                      left: "0",
                    },
                    "data-framer-background-image-wrapper": "true",
                  }}
                >
                  <img
                    {...{
                      decoding: "async",
                      width: "1254",
                      height: "1254",
                      sizes:
                        "(min-width: 1200px) 32px, (max-width: 809.98px) 32px, (min-width: 810px) and (max-width: 1199.98px) 32px",
                      srcSet:
                        "/assets/bb840e4cebe9ab90f4.png 512w,/assets/84d3c263a3e39cc9d8.png 1024w,/assets/bd5a0c313f21046b30.png 1254w",
                      src: "/assets/bd5a0c313f21046b30.png",
                      alt: "",
                      style: {
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        cornerShape: "inherit",
                        objectPosition: "center",
                        objectFit: "cover",
                      },
                      loading: "eager",
                    }}
                  />
                </div>
              </div>
              <div
                {...{
                  className: "framer-8j36ux",
                  "data-framer-component-type": "RichTextContainer",
                  style: {
                    "--framer-link-text-color": "rgb(0, 153, 255)",
                    "--framer-link-text-decoration": "underline",
                    transform: "none",
                  },
                }}
              >
                <p
                  {...{
                    className: "framer-text framer-styles-preset-ifqh6f",
                    "data-styles-preset": "BZ6xDUFj2",
                    dir: "auto",
                  }}
                >
                  {"Elevra"}
                </p>
              </div>
            </Link>
          </div>
          <div
            {...{
              className: "framer-byruad",
              "data-framer-name": "Menu wrap",
              "data-highlight": "true",
              tabIndex: "0",
            }}
          >
            <svg
              {...{
                className: "framer-iZmZi framer-1z0l4fp",
                role: "presentation",
                viewBox: "0 0 24 24",
                style: {
                  "--1m6trwb": "0",
                  "--21h8s6":
                    "var(--token-a502d7ad-2e01-4367-90e6-f868d55e1579, rgb(33, 45, 61))",
                  "--pgex8v": "2",
                },
              }}
            >
              <use {...{ href: "#3559153988" }}></use>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
