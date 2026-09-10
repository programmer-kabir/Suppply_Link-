import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstallmentFiles } from "../../../Redux/InstallmentFiles/InstallmentFilesSlice";

export default function useInstallmentFiles() {
  const dispatch = useDispatch();

  const { isLoading, installmentFiles, isError } =
    useSelector((state) => state.installmentFiles);
  const fetch = useCallback(() => {
    dispatch(fetchInstallmentFiles());
  }, [dispatch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    isLoading,
    installmentFiles,
    isError,
    refetch: fetch,
  };
}
