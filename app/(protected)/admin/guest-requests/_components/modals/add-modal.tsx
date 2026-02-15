import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/use-inventory";

export default function AddModal() {
  const { isLoading, error, addItem } = useInventory();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    await addItem(data);
    if (!error) {
      onClose();
    }
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Add New
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        radius="none"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                Add New Item
              </ModalHeader>
              <ModalBody>
                <Form className="w-full space-y-4" onSubmit={onSubmit}>
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 w-full p-4 space-y-8">
                      <div className="flex gap-4 w-full">
                        <Input
                          className="flex-1 w-full"
                          label="Name"
                          placeholder="Item name"
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
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                        />
                      </div>
                      <Textarea
                        name="description"
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
                        defaultSelectedKeys={["in-stock"]}
                      >
                        <SelectItem key="in-stock">In stock</SelectItem>
                        <SelectItem key="out-of-stock">Out of stock</SelectItem>
                        <SelectItem key="unavailable">unavailable</SelectItem>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 w-full pb-4">
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
}
