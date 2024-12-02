import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={`relative isolate flex aspect-square shrink-0 overflow-hidden rd-full ${className}`}
    {...props}
  />
));

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={`aspect-square h-full w-full bg-base4 rd-full ${className}`} {...props} />
));

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full  ${className}`}
    {...props}
  />
));

AvatarRoot.displayName = AvatarPrimitive.Root.displayName;
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export default function Avatar({ src, name, size }: { size: string; src: string; name?: string }) {
  return (
    <AvatarRoot style={{ width: size, height: size }} className="group">
      <AvatarImage src={src} />
      <AvatarFallback delayMs={1000}>
        {/* {name} */}
        <ProfilePicturePlaceholder name={name} />
      </AvatarFallback>
    </AvatarRoot>
  );
}

function ProfilePicturePlaceholder({ name }: { name?: string }) {
  return (
    <div className="h-full w-full relative isolate overflow-clip bg-base11">
      <div className="absolute rd-full h-1/2 w-1/2 top-40% left-50% -translate-x-1/2 -translate-y-1/2 bg-base7"></div>
      <div className="absolute rd-full h-4/5 w-4/5 top-110% left-50% -translate-x-1/2 -translate-y-1/2 bg-base7"></div>
      <div
        className=" h-full w-full z-100 absolute top-50% left-50% -translate-x-50%  -translate-y-50%   flex justify-center items-center
      opacity-0 hover:opacity-100 transition-opacity duration-300 "
      >
        {name}
      </div>
    </div>
  );
}
