import { useEffect, useState } from "react";
const useQuery = (promise, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const res = await promise(query);
      setData(res?.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
};

export default useQuery;
