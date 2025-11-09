import svgPaths from "./svg-kx1ofuyout";

function Frame3() {
  return (
    <div className="content-stretch flex font-['Roboto:Medium',sans-serif] font-medium items-center justify-between relative shrink-0 text-[20px] text-center w-[277px]">
      <p className="leading-[normal] relative shrink-0 text-[#9e9e9e] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Lectures
      </p>
      <div className="flex flex-col h-[11px] justify-center leading-[0] relative shrink-0 text-white w-[77px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Courses</p>
      </div>
      <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#9e9e9e] w-[63px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Tasks</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-[90px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[65px] py-[16px] relative w-[90px]">
          <p className="font-['Roboto:Medium',sans-serif] font-medium h-[15px] leading-[normal] relative shrink-0 text-[#9e9e9e] text-[20px] text-center w-[97px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Profile
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-black box-border content-center flex flex-wrap gap-[670px] h-[46px] items-center overflow-clip pl-[82px] pr-[76px] py-0 relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-[1220px]">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame40945() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#949494] text-[15px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Search tasks
      </p>
    </div>
  );
}

function FormField() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[500px]" data-name="Form Field">
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Frame40945 />
      <div className="relative shrink-0 size-[24px]" data-name="search">
        <div className="absolute inset-[16.67%_20.83%_20.83%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-4.67%]" style={{ "--stroke-0": "rgba(246, 246, 246, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
              <path d={svgPaths.p2427bf30} id="Icon" stroke="var(--stroke-0, #F6F6F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header">
      <FormField />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#6942d5] box-border content-stretch flex gap-[10px] h-[34px] items-center justify-center px-0 py-[14px] relative rounded-[8px] shrink-0 w-[199px]">
      <div className="flex flex-col font-['Roboto:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">ALGORITHMS</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative w-full">
          <div className="flex flex-col font-['Roboto:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre">DATA STRUCTURES</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative w-full">
          <div className="flex flex-col font-['Roboto:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre">SOMETHING ELSE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[6px] items-center justify-center pl-[6px] pr-0 py-[4px] relative w-full">
          <div className="flex flex-col font-['Roboto:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre">SOMETHING MORE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMenuProduct() {
  return (
    <div className="bg-[#242424] relative rounded-[14px] shrink-0 w-full" data-name="Tab Menu Product">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <Frame5 />
          <Button />
          <Button1 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-nowrap whitespace-pre" data-name="Text">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#6942d5] text-[12px]">021231</p>
      <p className="font-['Roboto_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#f6f6f6] text-[18px]">Find the First Missing Positive</p>
    </div>
  );
}

function Product() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-full items-start p-[12px] relative shrink-0 w-[250px]" data-name="Product">
      <Text />
    </div>
  );
}

function State() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="State">
      <div className="size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-[10px] h-[20px] items-center justify-end relative shrink-0 w-[54px]" data-name="Title">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#f6f6f6] text-[16px] text-right tracking-[0.16px] w-[35px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Easy
      </p>
    </div>
  );
}

function Date() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-between p-[12px] relative shrink-0 w-[150px]" data-name="Date">
      <div className="relative shrink-0 size-[20px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" fill="var(--fill-0, #ACE798)" id="Ellipse 1" r="10" />
        </svg>
      </div>
      <Title />
    </div>
  );
}

function Action() {
  return (
    <div className="box-border content-stretch flex flex-col h-full items-end justify-between p-[12px] relative shrink-0 w-[69px]" data-name="Action">
      <div className="h-[24px] overflow-clip relative shrink-0 w-[25px]" data-name="Star">
        <div className="absolute inset-[8.33%_8.33%_12.42%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-5.26%_-4.8%]" style={{ "--stroke-0": "rgba(176, 176, 176, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
              <path d={svgPaths.p2ce5ea00} id="Icon" stroke="var(--stroke-0, #B0B0B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemProduct() {
  return (
    <div className="content-stretch flex h-[66px] items-start relative shrink-0 w-full" data-name="Item Product">
      <Product />
      <State />
      <Date />
      <Action />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-nowrap whitespace-pre" data-name="Text">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#6942d5] text-[12px]">021231</p>
      <p className="font-['Roboto_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#f6f6f6] text-[18px]">Design a Min Stack</p>
    </div>
  );
}

function Product1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-full items-start p-[12px] relative shrink-0 w-[250px]" data-name="Product">
      <Text1 />
    </div>
  );
}

function State1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="State">
      <div className="size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0 w-[59px]" data-name="Title">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#f6f6f6] text-[16px] text-right tracking-[0.16px] w-[60px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Medium
      </p>
    </div>
  );
}

function Date1() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-between p-[12px] relative shrink-0 w-[150px]" data-name="Date">
      <div className="relative shrink-0 size-[20px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" fill="var(--fill-0, #FFEE9C)" id="Ellipse 1" r="10" />
        </svg>
      </div>
      <Title1 />
    </div>
  );
}

function Action1() {
  return (
    <div className="box-border content-stretch flex flex-col h-full items-end justify-between p-[12px] relative shrink-0 w-[69px]" data-name="Action">
      <div className="h-[24px] overflow-clip relative shrink-0 w-[25px]" data-name="Star">
        <div className="absolute inset-[8.33%_8.33%_12.42%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-5.26%_-4.8%]" style={{ "--stroke-0": "rgba(176, 176, 176, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
              <path d={svgPaths.p2ce5ea00} id="Icon" stroke="var(--stroke-0, #B0B0B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemProduct1() {
  return (
    <div className="content-stretch flex h-[66px] items-start relative shrink-0 w-full" data-name="Item Product">
      <Product1 />
      <State1 />
      <Date1 />
      <Action1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-nowrap whitespace-pre" data-name="Text">
      <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#6942d5] text-[12px]">021231</p>
      <p className="font-['Roboto_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#f6f6f6] text-[18px]">Count Inversions in an Array</p>
    </div>
  );
}

function Product2() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-full items-start p-[12px] relative shrink-0 w-[250px]" data-name="Product">
      <Text2 />
    </div>
  );
}

function State2() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="State">
      <div className="size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0 w-[54px]" data-name="Title">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#f6f6f6] text-[16px] text-nowrap text-right tracking-[0.16px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Hard
      </p>
    </div>
  );
}

function Date2() {
  return (
    <div className="box-border content-stretch flex h-full items-center justify-between p-[12px] relative shrink-0 w-[150px]" data-name="Date">
      <div className="relative shrink-0 size-[20px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" fill="var(--fill-0, #FE6868)" id="Ellipse 1" r="10" />
        </svg>
      </div>
      <Title2 />
    </div>
  );
}

function Action2() {
  return (
    <div className="box-border content-stretch flex flex-col h-full items-end justify-between p-[12px] relative shrink-0 w-[69px]" data-name="Action">
      <div className="h-[24px] overflow-clip relative shrink-0 w-[25px]" data-name="Star">
        <div className="absolute inset-[8.33%_8.33%_12.42%_8.33%]" data-name="Icon">
          <div className="absolute inset-[-5.26%_-4.8%]" style={{ "--stroke-0": "rgba(176, 176, 176, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
              <path d={svgPaths.p2ce5ea00} id="Icon" stroke="var(--stroke-0, #B0B0B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemProduct2() {
  return (
    <div className="content-stretch flex h-[66px] items-start relative shrink-0 w-full" data-name="Item Product">
      <Product2 />
      <State2 />
      <Date2 />
      <Action2 />
    </div>
  );
}

function Conten() {
  return (
    <div className="bg-[#242424] content-stretch flex flex-col items-start relative rounded-[16px] shrink-0 w-full" data-name="Conten">
      <div aria-hidden="true" className="absolute border border-[#3d3d3d] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <ItemProduct />
      <div className="h-0 relative shrink-0 w-full" data-name="Seperator">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(61, 61, 61, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1050 1">
            <line id="Seperator" stroke="var(--stroke-0, #3D3D3D)" x2="1050" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ItemProduct1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Seperator">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(61, 61, 61, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1050 1">
            <line id="Seperator" stroke="var(--stroke-0, #3D3D3D)" x2="1050" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ItemProduct2 />
      <ItemProduct />
      <ItemProduct1 />
      <ItemProduct2 />
    </div>
  );
}

function Number() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[3px] items-start leading-[0] relative shrink-0 text-[16px] text-nowrap tracking-[0.16px]" data-name="Number">
      <div className="flex flex-col justify-center relative shrink-0 text-[#6942d5]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">1</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-neutral-500" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">-</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#b0b0b0]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">8</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#b0b0b0]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">of 13 Pages</p>
      </div>
    </div>
  );
}

function Frame480965893() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#b0b0b0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#f6f6f6] text-[16px] text-nowrap tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">1</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="arrow solid - Down">
        <div className="absolute inset-[29.17%_16.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 9">
            <path d={svgPaths.p24378e80} fill="var(--fill-0, #F6F6F6)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <div className="content-stretch flex gap-[13px] items-center relative shrink-0" data-name="Page">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap tracking-[0.16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">The page on</p>
      </div>
      <Frame480965893 />
    </div>
  );
}

function IconLeft() {
  return (
    <div className="box-border content-stretch flex items-start px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Icon Left">
      <div aria-hidden="true" className="absolute border border-[#b0b0b0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="arrow-back-simple">
        <div className="absolute flex inset-[16.67%_37.5%_16.67%_29.17%] items-center justify-center">
          <div className="flex-none h-[16px] rotate-[180deg] scale-y-[-100%] w-[8px]">
            <div className="relative size-full" data-name="Icon">
              <div className="absolute inset-[-7.5%_-15%]" style={{ "--stroke-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 16">
                  <path d={svgPaths.p134f6ec0} id="Icon" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconRight() {
  return (
    <div className="box-border content-stretch flex items-start px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Icon Right">
      <div aria-hidden="true" className="absolute border border-[#b0b0b0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="arrow-forward-simple">
        <div className="absolute inset-[16.67%_29.17%_16.67%_37.5%]" data-name="Icon">
          <div className="absolute inset-[-7.5%_-15%]" style={{ "--stroke-0": "rgba(246, 246, 246, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 16">
              <path d={svgPaths.p134f6ec0} id="Icon" stroke="var(--stroke-0, #F6F6F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaIcon() {
  return (
    <div className="content-stretch flex gap-[6px] items-start relative shrink-0" data-name="CTA ICON">
      <IconLeft />
      <IconRight />
    </div>
  );
}

function Frame480965894() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Page />
      <CtaIcon />
    </div>
  );
}

function Tabble() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[24px] h-[664px] items-start p-[24px] relative rounded-[24px] shrink-0 w-[1098px]" data-name="Tabble">
      <Header />
      <TabMenuProduct />
      <Conten />
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Pagination">
        <Number />
        <Frame480965894 />
      </div>
    </div>
  );
}

function DarkGradient06() {
  return (
    <div className="h-[638px] relative shrink-0 w-[1234px]" data-name="Dark Gradient 06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1234 638">
        <g clipPath="url(#clip0_1_645)" id="Dark Gradient 06">
          <rect fill="black" height="638" width="1234" />
          <g filter="url(#filter0_f_1_645)" id="Ellipse 13">
            <ellipse cx="1337" cy="987" fill="var(--fill-0, #4D3589)" rx="683" ry="623" />
          </g>
          <g filter="url(#filter1_f_1_645)" id="Ellipse 14">
            <ellipse cx="269.107" cy="739.933" fill="var(--fill-0, #0025CE)" rx="651.829" ry="344.872" transform="rotate(10.5409 269.107 739.933)" />
          </g>
          <g filter="url(#filter2_f_1_645)" id="Vector 11">
            <path d={svgPaths.p33423700} fill="var(--fill-0, #00EAFF)" />
          </g>
          <g filter="url(#filter3_f_1_645)" id="Vector 10">
            <path d={svgPaths.p1738f680} fill="var(--fill-0, #BADAFF)" />
          </g>
          <g filter="url(#filter4_f_1_645)" id="Ellipse 15">
            <ellipse cx="-19.5" cy="364" fill="var(--fill-0, #303E57)" rx="295.5" ry="265" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1846" id="filter0_f_1_645" width="1966" x="354" y="64">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_645" stdDeviation="150" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1519.02" id="filter1_f_1_645" width="2087.95" x="-774.867" y="-19.5753">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_645" stdDeviation="200" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1173.59" id="filter2_f_1_645" width="1573.16" x="-535.728" y="-11.814">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_645" stdDeviation="100" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1037.62" id="filter3_f_1_645" width="2261.1" x="-295.5" y="399.039">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_645" stdDeviation="100" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1130" id="filter4_f_1_645" width="1191" x="-615" y="-201">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_1_645" stdDeviation="150" />
          </filter>
          <clipPath id="clip0_1_645">
            <rect fill="white" height="638" width="1234" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[49px] items-center relative size-full">
      <Frame2 />
      <Tabble />
      <DarkGradient06 />
    </div>
  );
}