const Spinner = ({
  size = "h-5 w-5",
  color = "border-white",
}) => {
  return (
    <div
      className={`
        ${size}
        animate-spin
        rounded-full
        border-2
        ${color}
        border-t-transparent
      `}
    />
  );
};

export default Spinner;