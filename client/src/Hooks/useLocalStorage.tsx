const useLocalStorage = () => {
  return {
    set: (name: string, data: unknown = "") =>
      localStorage.setItem(name, JSON.stringify(data)),
    get: <T,>(name: string): T | null => {
      const item = localStorage.getItem(name);
      return item === null ? null : (JSON.parse(item) as T);
    },
    remove: (name: string) => localStorage.removeItem(name),
  };
};

export default useLocalStorage;
