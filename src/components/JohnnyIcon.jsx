export default function JohnnyIcon({ size = 24 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="2"/>
      <path 
        d="M8 9.5C8 9.5 9.5 11 12 11C14.5 11 16 9.5 16 9.5" 
        stroke="#000" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="1" fill="#000"/>
      <circle cx="15" cy="9" r="1" fill="#000"/>
      <path d="M12 14L12 17" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17.5" r="0.5" fill="#000"/>
    </svg>
  );
}
