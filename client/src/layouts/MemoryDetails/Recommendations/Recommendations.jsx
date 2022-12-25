//UI Components
import { Center } from "@mantine/core";
import { Text, SimpleGrid } from "@mantine/core";
import { Common } from "components";

const Recommendations = ({ recos }) => {
  return (
    <SimpleGrid cols={1} spacing="xs">
      {recos.length > 0 ? (
        recos.map((reco) => (
          <Common.Cards.Recommendation key={reco.title} data={reco} />
        ))
      ) : (
        <Center>
          <Text color="dimmed">No similar memories were found</Text>
        </Center>
      )}
    </SimpleGrid>
  );
};

export default Recommendations;
