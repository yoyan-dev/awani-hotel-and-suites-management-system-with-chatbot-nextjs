import React, { useEffect, useState } from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Chip,
  Divider,
} from "@heroui/react";

import {
  Plus,
  Search,
  CheckCircle,
  Utensils,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { menuCategory } from "@/app/constants/banquet-menus";

export default function AddModal() {
  const [selectedMenus, setSelectedMenus] = useState<any[]>([]);

  const { isLoading, error, addBanquetPackage } = useBanquetPackages();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  function toggleMenuSelection(menu: string) {
    const exist = selectedMenus.some((m) => m === menu);

    if (exist) {
      setSelectedMenus((prev) => prev.filter((m) => m !== menu));
    } else {
      setSelectedMenus((prev) => [...prev, menu]);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Add selected menus JSON
    data.append("categories", JSON.stringify(selectedMenus));

    await addBanquetPackage(data);
    if (!error) {
      onClose();
      setSelectedMenus([]);
    }
  }

  return (
    <>
      <Button
        color="primary"
        endContent={<Plus size={18} />}
        size="sm"
        onPress={onOpen}
      >
        Add New
      </Button>

      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        radius="none"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Add New Banquet Package
                </div>
              </ModalHeader>

              <ModalBody className="pb-6">
                <Form className="w-full space-y-6" onSubmit={onSubmit}>
                  <div className="flex gap-4 w-full">
                    <Input
                      fullWidth
                      required
                      label="Package Name"
                      placeholder="Enter package name"
                      name="name"
                      variant="bordered"
                      isRequired
                      radius="sm"
                      labelPlacement="outside"
                    />

                    <Input
                      fullWidth
                      required
                      label="Price"
                      placeholder="00.00"
                      name="price_per_cover"
                      startContent="₱"
                      variant="bordered"
                      radius="sm"
                      labelPlacement="outside"
                    />
                  </div>
                  <Divider />

                  <div className="flex gap-4 flex-wrap">
                    {menuCategory.map((menu: any) => {
                      const isSelected = selectedMenus.some(
                        (m) => m === menu.uid
                      );

                      return (
                        <div
                          key={menu.uid}
                          onClick={() => toggleMenuSelection(menu.uid)}
                          className={`flex items-center justify-between px-4 py-2 rounded-lg  cursor-pointer transition-all 
                            hover:bg-default-100 hover:shadow-sm 
                            ${
                              isSelected
                                ? "bg-gray-200 shadow-sm"
                                : "bg-gray-100"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Utensils size={16} className="text-primary" />
                            <span className="font-medium">{menu.name}</span>
                          </div>

                          {isSelected && (
                            <CheckCircle
                              size={20}
                              className="text-primary transition-opacity"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedMenus.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Selected Menus:</p>

                      <div className="flex flex-wrap gap-2">
                        {selectedMenus.map((menu) => (
                          <Chip
                            key={menu}
                            onClose={() =>
                              setSelectedMenus((prev) =>
                                prev.filter((s) => s !== menu)
                              )
                            }
                            color="primary"
                            variant="flat"
                            radius="sm"
                            startContent={<Utensils size={14} />}
                          >
                            {menu}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt- w-full">
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
