export default function Banner({ children, label }) {
  return (
    <div className="relative h-[140px] w-full rounded-xl linear-gradient">
      <p className="absolute bottom-[15px] left-[38px] text-[36px] font-[700] text-white">
        {label || "Banner"}
      </p>
      <div className="absolute bottom-0 right-[140px]">{children}</div>
    </div>
  );
}
