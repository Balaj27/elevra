import Link from "next/link";
export default function MobileNavigation() {
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
                "data-framer-page-link-current": "true",
                "aria-label": "S MAGO CPA, PC home",
                "data-copy-brand": "",
              }}
            >
              <img
                {...{
                  src: "/brand/s-mago-logo.png",
                  alt: "S MAGO CPA, PC",
                  width: "606",
                  height: "158",
                }}
              />
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
