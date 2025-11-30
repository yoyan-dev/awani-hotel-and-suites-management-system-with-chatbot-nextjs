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
import { useBanquetMenus } from "@/hooks/use-banquet-menus";
import { menuCategory } from "@/app/constants/banquet-menus";

export default function AddModal() {
  const { isLoading, error, addBanquetMenu } = useBanquetMenus();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);

    await addBanquetMenu(formdata);
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
        Menu
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
                Add New Banquet Menu
              </ModalHeader>
              <ModalBody>
                <Form className="w-full space-y-4" onSubmit={onSubmit}>
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 w-full p-4 space-y-8">
                      <div className="flex gap-4 w-full">
                        <Input
                          fullWidth
                          isRequired
                          className="flex-1 w-full"
                          label="Name"
                          placeholder="Menu name"
                          name="name"
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                        />
                      </div>
                      <Select
                        isRequired
                        className="flex-1 w-full"
                        name="category"
                        label="Item category"
                        labelPlacement="outside"
                        placeholder="Select menu category"
                        variant="bordered"
                        radius="none"
                        items={menuCategory}
                      >
                        {(item) => (
                          <SelectItem key={item.uid} textValue={item.name}>
                            {item.name}
                          </SelectItem>
                        )}
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
