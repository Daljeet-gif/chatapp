import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutatationhook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutaion] = mutatationhook();

  const executeMuation = async (toastMesage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMesage || "Upadating data...");

    try {
      const res = await mutaion(...args);

      if (res.data) {
        toast.success(res.data.message || "updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Somthing went wrog", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMuation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
