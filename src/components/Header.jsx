import JohnnyIcon from './JohnnyIcon';

export default function Header({ onHome }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
      <div
        className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={onHome}
      >
        <JohnnyIcon size={24} />
        <div className="text-base font-semibold text-black">Johnny</div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onHome}
          className="px-4 py-2 text-sm font-medium text-black bg-transparent hover:opacity-70 transition-opacity"
        >
          New chat
        </button>
        <button className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
          Sign up
        </button>
      </div>
    </div>
  );
}
