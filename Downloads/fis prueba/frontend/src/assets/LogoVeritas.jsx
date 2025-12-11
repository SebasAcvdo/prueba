export const LogoVeritas = ({ color = "white", width = 120, height = 40 }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 120 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="10"
      y="28"
      fill={color}
      fontSize="16"
      fontWeight="700"
      fontFamily="Inter, sans-serif"
    >
      JARDÍN APRENDIENDO JUNTOS
    </text>
    <circle cx="6" cy="20" r="3" fill={color === "white" ? "#FA761B" : "#FA761B"} />
  </svg>
);

export default LogoVeritas;
