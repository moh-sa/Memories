//Hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//Actions
import { search, memory } from "services";
//Components
import { SpotlightProvider } from "@mantine/spotlight";
//Icons
import { TbSearch, TbTag, TbHome } from "react-icons/tb";
import { MdOutlineLibraryBooks } from "react-icons/md";

const Provider = ({ children }) => {
  //hooks
  const navigate = useNavigate();
  const [actions, setActions] = useState([]);

  const getData = async () => {
    try {
      const titlesPromise = search.getTitles();
      const tagsPromise = memory.getTags();
      const [titlesData, tagsData] = await Promise.all([
        titlesPromise,
        tagsPromise,
      ]);

      const titlesArr = titlesData.data.data.titles;
      const tagsArr = tagsData.data.data.tags;

      const titlesObjs = titlesArr.map((title) => ({
        title,
        description: "memory",
        group: "memories",
        onTrigger: () => navigate(`/search?query=${title}`),
        icon: <MdOutlineLibraryBooks size={18} />,
      }));
      const tagsObjs = tagsArr.map((tag) => ({
        title: tag,
        description: "tag",
        group: "tags",
        onTrigger: () => navigate(`/search?tags=${tag}`),
        icon: <TbTag size={18} />,
      }));

      const home = {
        title: "Home",
        group: "main",
        onTrigger: () => navigate(`/`),
        icon: <TbHome size={18} />,
      };
      const data = [home, ...titlesObjs, ...tagsObjs];

      setActions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SpotlightProvider
      actions={actions}
      limit={7}
      shortcut="mod + K"
      searchPlaceholder="Search by title..."
      nothingFoundMessage="Nothing found..."
      searchIcon={<TbSearch size={18} />}
    >
      {children}
    </SpotlightProvider>
  );
};

export default Provider;
