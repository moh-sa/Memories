// UI Components
import { Text, Button, Modal, Group, Container } from "@mantine/core";

interface DeleteProps {
  open: boolean;
  close: () => void;
  yes: () => void;
}

const _Delete = ({ open, close, yes }: DeleteProps) => {
  return (
    <Modal opened={open} onClose={close} title="Delete Confirmation">
      <Container>
        <Text>Are you sure you want to delete?</Text>
        <Group grow spacing="xl" position="center" mt="md">
          <Button color="red" onClick={yes}>
            YES
          </Button>
          <Button onClick={close}>NO</Button>
        </Group>
      </Container>
    </Modal>
  );
};

export default _Delete;
