import { useNavigate } from "react-router-dom";

const usePageNavigation = () => {
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  } // Go back one page
  const goForward = () => navigate(1); // Go forward one page
  const goTo = (path) => navigate(path); // Go to a specific path
  return {
    goBack,
    goForward,
    goTo,
  };
};

export default usePageNavigation;
