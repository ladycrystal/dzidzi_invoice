import LoadingScreen from "../../components/common/LoadingScreen";
import MessageBox from "../../components/common/MessageBox";

const useLoadingError = ({ loading, error, errorMsg }) => {
  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return (
      <MessageBox
        message={
          errorMsg || (typeof error === "string" ? error : "An error occurred.")
        }
        isError
        style={{
          display: "block",
          margin: "20px auto",
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
          padding: "12px 24px",
          borderRadius: "6px",
          fontWeight: 500,
        }}
      />
    );
  }
  return null;
};

export default useLoadingError;
