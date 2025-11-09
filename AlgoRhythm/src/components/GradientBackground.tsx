import svgPaths from "../imports/svg-zxyhn84scj";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <g clipPath="url(#clip0_bg)" id="Dark Gradient">
          <rect fill="black" height="100%" width="100%" />
          <g filter="url(#filter0_f_bg)" id="Ellipse 13">
            <ellipse cx="1337" cy="987" fill="#4D3589" rx="683" ry="623" />
          </g>
          <g filter="url(#filter1_f_bg)" id="Ellipse 14">
            <ellipse cx="269.107" cy="739.933" fill="#0025CE" rx="651.829" ry="344.872" transform="rotate(10.5409 269.107 739.933)" />
          </g>
          <g filter="url(#filter2_f_bg)" id="Vector 11">
            <path d={svgPaths.p33423700} fill="#00EAFF" />
          </g>
          <g filter="url(#filter3_f_bg)" id="Vector 10">
            <path d={svgPaths.p1738f680} fill="#BADAFF" />
          </g>
          <g filter="url(#filter4_f_bg)" id="Ellipse 15">
            <ellipse cx="-26.5" cy="364" fill="#303E57" rx="295.5" ry="265" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1846" id="filter0_f_bg" width="1966" x="354" y="64">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_bg" stdDeviation="150" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1519.02" id="filter1_f_bg" width="2087.95" x="-774.867" y="-19.5753">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_bg" stdDeviation="200" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1173.59" id="filter2_f_bg" width="1573.16" x="-535.728" y="-11.814">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_bg" stdDeviation="100" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1037.62" id="filter3_f_bg" width="2261.1" x="-295.5" y="399.039">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_bg" stdDeviation="100" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1130" id="filter4_f_bg" width="1191" x="-622" y="-201">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_bg" stdDeviation="150" />
          </filter>
          <clipPath id="clip0_bg">
            <rect fill="white" height="100%" width="100%" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
