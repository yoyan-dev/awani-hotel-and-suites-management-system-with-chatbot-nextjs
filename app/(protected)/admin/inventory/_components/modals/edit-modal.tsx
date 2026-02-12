import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Inventory } from "@/types/inventory";
import { useInventory } from "@/hooks/use-inventory";
interface UpdateModalProps {
  inventory: Inventory;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  inventory,
  isOpen,
  onClose,
}) => {
  const { isLoading, error, UpdateItem } = useInventory();
  const [item, setItem] = React.useState<Inventory>(inventory);

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: Inventory
  ) {
    e.preventDefault();

    await UpdateItem(payload);
    if (!error) {
      onClose();
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={(open) => !open && onClose}
        radius="none"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                Update Item
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full space-y-4"
                  onSubmit={(e) => onSubmit(e, item)}
                >
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 w-full p-4 space-y-8">
                      <div className="flex gap-4 w-full">
                        <Input
                          className="flex-1 w-full"
                          label="Name"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) =>
                            setItem({ ...item, name: e.target.value })
                          }
                          name="name"
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                        />
                        <Input
                          className="flex-1 w-full"
                          label="Quantity"
                          placeholder="Item quantity"
                          name="quantity"
                          value={item.quantity.toString() ?? ""}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              quantity: Number(e.target.value),
                            })
                          }
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                        />
                      </div>
                      <Input
                        fullWidth
                        label="Price"
                        placeholder="00.00"
                        name="price"
                        type="number"
                        variant="bordered"
                        startContent="₱"
                        radius="none"
                        labelPlacement="outside"
                        value={item.price?.toString() ?? ""}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            price: Number(e.target.value),
                          })
                        }
                      />
                      <Textarea
                        name="description"
                        value={item.description}
                        onChange={(e) =>
                          setItem({ ...item, description: e.target.value })
                        }
                        placeholder="Item description"
                        label="Description"
                        labelPlacement="outside"
                        variant="bordered"
                        radius="none"
                      />
                      <Select
                        className="flex-1 w-full"
                        name="status"
                        label="Item status"
                        labelPlacement="outside"
                        placeholder="Select Item status"
                        variant="bordered"
                        radius="none"
                        defaultSelectedKeys={[item.status || "in-stock"]}
                        value={item.status}
                        onChange={(e) =>
                          setItem({
                            ...item,
                            status: e.target.value as Inventory["status"],
                          })
                        }
                      >
                        <SelectItem key="in-stock">In stock</SelectItem>
                        <SelectItem key="out-of-stock">Out of stock</SelectItem>
                        <SelectItem key="unavailable">unavailable</SelectItem>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 w-full">
                    <Button onPress={onClose} variant="bordered" radius="sm">
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={isLoading}
                      radius="sm"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModal;
