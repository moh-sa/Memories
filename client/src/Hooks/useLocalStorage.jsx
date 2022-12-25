const useLocalStorage = () => {
  return {
    set: (name, data = "") => localStorage.setItem(name, JSON.stringify(data)),
    get: (name) => JSON.parse(localStorage.getItem(name)),
    remove: (name) => localStorage.removeItem(name),
  };
};

export default useLocalStorage;
