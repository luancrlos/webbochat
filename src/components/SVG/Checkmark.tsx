import React, { SVGProps } from "react"

const ICheckmark = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path
      fill="#43A047"
      d="M40.6 12.1 17 35.7l-9.6-9.6L4.6 29 17 41.3l26.4-26.4z"
    />
  </svg>
);

export default ICheckmark;