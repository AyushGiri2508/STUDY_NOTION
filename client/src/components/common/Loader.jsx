const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container"><div className="loader" /><p className="loader-text">{text}</p></div>
);
export default Loader;
